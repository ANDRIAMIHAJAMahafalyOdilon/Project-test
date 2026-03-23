/**
 * Persistance des mocks API dans localStorage pour conserver les données
 * après un rafraîchissement de page (mode sans backend).
 * Clé versionnée pour pouvoir invalider en cas de changement de schéma.
 */
const PREFIX = 'docuflow:mock:v1:';

export function loadMockState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveMockState(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota, mode privé, etc.
  }
}
