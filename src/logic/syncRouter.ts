/**
 * Registro del usuario actualmente autenticado.
 * Los módulos de storage lo consultan para decidir si escriben en
 * Firestore (usuario logueado) o solo en localStorage (anónimo).
 *
 * AuthContext llama a setCurrentUid() cuando el estado de auth cambia.
 */

let _uid: string | null = null;

export function setCurrentUid(uid: string | null): void {
  _uid = uid;
  console.log('[syncRouter] UID:', uid ?? 'null (sin sesión)');
}

export function getCurrentUid(): string | null {
  return _uid;
}

export function isLoggedIn(): boolean {
  return _uid !== null;
}
