import type { Auth } from 'firebase/auth';
import { getRedirectResult } from 'firebase/auth';

/**
 * getRedirectResult solo puede consumirse una vez por vuelta del OAuth.
 * React 18 Strict Mode monta el efecto dos veces en desarrollo; sin esto la segunda
 * llamada devuelve null y el usuario puede quedar sin sesión + pantalla en blanco.
 */
let redirectResultInFlight: Promise<void> | null = null;

export function consumeFirebaseRedirectResult(auth: Auth): Promise<void> {
  if (redirectResultInFlight) return redirectResultInFlight;
  redirectResultInFlight = getRedirectResult(auth)
    .then((result) => {
      if (result?.user && import.meta.env.DEV) {
        console.info('[Firebase Auth] Redirect sign-in OK:', result.user.email);
      }
    })
    .catch((err: { code?: string; message?: string }) => {
      console.warn('[Firebase Auth] getRedirectResult:', err?.code ?? err?.message ?? err);
    })
    .finally(() => {
      redirectResultInFlight = null;
    });
  return redirectResultInFlight;
}
