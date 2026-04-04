import { useMemo } from 'react';
import { preguntasAventura } from '../data/aventura';
import { destinos, getDestinoBySlug, type Destino } from '../data/destinos';
import { useAuth } from '../context/AuthContext';
import {
  getAventuraProgress,
  hasInProgressAventura,
  type AventuraProgress,
} from '../logic/aventuraStorage';
import { getLastDestinoSlug, getRecentDestinoSlugs } from '../logic/destinosHomeStorage';
import { recomendarDestinos, type TemporadaId } from '../logic/motorAventura';
import { armarInputDesdeRespuestasUrl } from '../logic/motorAventuraDinamico';

function presupuestoArsFromWizardId(id: string | undefined): number {
  if (id === 'economico') return 200_000;
  if (id === 'sin_mirar') return 2_500_000;
  return 600_000;
}

function curatedFallbackDestinos(): Destino[] {
  const out: Destino[] = [];
  const byTag = new Map<string, Destino>();
  for (const d of destinos) {
    const key = (d.tags?.[0] ?? d.region ?? d.id) as string;
    if (!byTag.has(key)) byTag.set(key, d);
  }
  for (const d of byTag.values()) {
    out.push(d);
    if (out.length >= 8) break;
  }
  for (const d of destinos) {
    if (out.length >= 8) break;
    if (!out.includes(d)) out.push(d);
  }
  return out.slice(0, 8);
}

function recommendedFromRespuestas(r: Record<string, string>): Destino[] {
  if (!r.experiencia) return curatedFallbackDestinos();
  const ars = presupuestoArsFromWizardId(r.presupuesto);
  const temp = (r.temporada as TemporadaId) || 'flexible';
  const input = armarInputDesdeRespuestasUrl(r, ars, temp);
  return recomendarDestinos(destinos, input, { max: 8 });
}

export type HomeHubState = {
  ready: boolean;
  /** Sin cuenta y sin actividad persistida: UI clásica completa. */
  isColdHub: boolean;
  greetingFirstName: string;
  lastHeroImageUrl: string | undefined;
  recentDestinos: Destino[];
  recommendedDestinos: Destino[];
  aventuraProgress: AventuraProgress | null;
  aventuraTotalPasos: number;
  hasActiveAventura: boolean;
};

export function useHomeHubState(): HomeHubState {
  const { user, ready } = useAuth();

  return useMemo((): HomeHubState => {
    const recentSlugs = getRecentDestinoSlugs();
    const hasRecent = recentSlugs.length > 0;
    const inProgress = hasInProgressAventura();
    const persistedActivity = hasRecent || inProgress;
    const isColdHub = user == null && !persistedActivity;

    const lastSlug = getLastDestinoSlug();
    const lastDestino = lastSlug ? getDestinoBySlug(lastSlug) : undefined;

    const recentDestinos = recentSlugs
      .map((s) => getDestinoBySlug(s))
      .filter((d): d is Destino => d != null);

    const progress = getAventuraProgress();
    const r = progress?.respuestas ?? {};
    const recommendedDestinos = recommendedFromRespuestas(r);

    const rawName = user?.displayName?.trim() || '';
    const greetingFirstName = rawName ? rawName.split(/\s+/)[0]! : 'viajero';

    return {
      ready,
      isColdHub,
      greetingFirstName,
      lastHeroImageUrl: lastDestino?.imageUrl,
      recentDestinos,
      recommendedDestinos,
      aventuraProgress: inProgress && progress ? progress : null,
      aventuraTotalPasos: preguntasAventura.length,
      hasActiveAventura: inProgress,
    };
  }, [user, ready]);
}
