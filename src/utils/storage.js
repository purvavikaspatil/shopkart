/**
 * Safe localStorage wrapper.
 * Every read/write is guarded so private-browsing modes, quota errors or
 * corrupted JSON can never crash the app - we fall back to the default value.
 */

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] Could not read "${key}"`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] Could not write "${key}"`, error);
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Could not remove "${key}"`, error);
  }
}
