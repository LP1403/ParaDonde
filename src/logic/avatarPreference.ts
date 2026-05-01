import { getCurrentUid } from './syncRouter';
import { updateUserProfile } from '../services/firestoreService';

const STORAGE_KEY = 'paradonde_avatar_choice_v1';

export const AVATAR_PRESETS = ['🧭', '🌎', '✈️', '🧳', '🏔️', '🌊', '🗺️', '☀️', '🦙', '🌋'] as const;

export type AvatarChoice =
  | { mode: 'google' }
  | { mode: 'emoji'; emoji: string };

export function getAvatarChoice(): AvatarChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== 'object') return null;
    if ((p as { mode?: string }).mode === 'google') return { mode: 'google' };
    const em = (p as { mode?: string; emoji?: string }).emoji;
    if ((p as { mode?: string }).mode === 'emoji' && typeof em === 'string' && em.length > 0 && em.length <= 8) {
      return { mode: 'emoji', emoji: em };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function setAvatarChoice(choice: AvatarChoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    window.dispatchEvent(new CustomEvent('pd-avatar-changed'));
  } catch {
    /* ignore */
  }
  // Firestore sync (fire and forget)
  const uid = getCurrentUid();
  if (uid) void updateUserProfile(uid, { avatarChoice: choice });
}

export type MenuTriggerAvatar = { kind: 'photo'; src: string } | { kind: 'emoji'; emoji: string };

/**
 * Qué mostrar en el botón Cuenta: foto Google si aplica, si no emoji (invitado = 👤).
 */
export function resolveMenuTriggerAvatar(user: { photoURL?: string } | null): MenuTriggerAvatar {
  if (!user) {
    return { kind: 'emoji', emoji: '👤' };
  }
  const choice = getAvatarChoice();
  if (choice?.mode === 'emoji') {
    return { kind: 'emoji', emoji: choice.emoji };
  }
  const useGoogle = !choice || choice.mode === 'google';
  if (useGoogle && user.photoURL?.trim()) {
    return { kind: 'photo', src: user.photoURL.trim() };
  }
  return { kind: 'emoji', emoji: AVATAR_PRESETS[0] };
}
