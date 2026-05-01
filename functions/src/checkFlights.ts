/**
 * Cloud Function: onVueloActualizado
 *
 * Se dispara automáticamente cuando el usuario actualiza un vuelo en la app
 * (presiona el botón "Actualizar"). NO hace llamadas a Aviationstack — esas
 * las hace la app cuando el usuario lo pide. Esta función solo compara el
 * status anterior con el nuevo y envía una notificación push si cambió.
 *
 * Flujo:
 *   Usuario presiona "Actualizar"
 *     → App llama Aviationstack (1 request)
 *     → App guarda nuevo dato en Firestore
 *       → Esta función detecta el cambio de status
 *         → Envía notificación FCM si el status cambió
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

// ─── Tipos ────────────────────────────────────────────────────────

interface FcmTokenDoc {
  token: string;
}

// ─── Helper: notificar al usuario ─────────────────────────────────

async function notifyUser(
  uid: string,
  flightIata: string,
  newStatus: string,
  destinoSlug: string,
  flightId: string,
): Promise<void> {
  const tokensSnap = await db
    .collection('users')
    .doc(uid)
    .collection('fcmTokens')
    .get();

  if (tokensSnap.empty) return;

  const tokens = tokensSnap.docs
    .map((d) => (d.data() as FcmTokenDoc).token)
    .filter(Boolean);

  if (!tokens.length) return;

  const statusLabel: Record<string, string> = {
    scheduled: 'Programado',
    active: 'En vuelo ✈',
    landed: 'Aterrizado',
    cancelled: 'Cancelado',
    incident: 'Incidente',
    diverted: 'Desviado',
    unknown: 'Sin datos',
  };

  const label = statusLabel[newStatus] ?? newStatus;
  const title = `✈ ${flightIata} — Estado actualizado`;
  const body = `Nuevo estado: ${label}`;

  const sendPromises = tokens.map((token) =>
    messaging
      .send({
        token,
        notification: { title, body },
        data: { slug: destinoSlug, flightId },
        webpush: {
          notification: { title, body, icon: '/favicon.ico' },
        },
      })
      .catch((err: Error) => {
        // Token vencido o inválido: ignorar silenciosamente
        functions.logger.warn(`[FCM] Token inválido uid=${uid}:`, err.message);
      }),
  );

  await Promise.all(sendPromises);
}

// ─── Trigger: escritura en Firestore cuando el usuario refresca ───

export const onVueloActualizado = functions.firestore
  .document('users/{uid}/vuelos/{flightId}')
  .onWrite(async (change, context) => {
    // Documento eliminado → nada que hacer
    if (!change.after.exists) return;

    const { uid, flightId } = context.params as { uid: string; flightId: string };

    const before = change.before.exists
      ? (change.before.data() as { lastKnownStatus?: string })
      : null;
    const after = change.after.data() as {
      lastKnownStatus: string;
      flightIata: string;
      destinoSlug: string;
    };

    const prevStatus = before?.lastKnownStatus ?? null;
    const newStatus = after.lastKnownStatus;

    // Sin cambio de status → no notificar
    if (!newStatus || newStatus === prevStatus) return;

    // Status "aburridos" que no merecen notificación (ej. scheduled → scheduled)
    const SILENCIOSO = new Set(['scheduled', 'unknown']);
    if (SILENCIOSO.has(newStatus) && prevStatus === null) return;

    functions.logger.info(
      `[onVueloActualizado] uid=${uid} flightId=${flightId}: ${prevStatus ?? 'nuevo'} → ${newStatus}`,
    );

    await notifyUser(uid, after.flightIata, newStatus, after.destinoSlug, flightId);
  });
