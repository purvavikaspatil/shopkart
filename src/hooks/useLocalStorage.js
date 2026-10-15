import { useState, useCallback, useEffect } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

/**
 * useState that persists to localStorage.
 * Also listens for the `storage` event so two open tabs stay in sync.
 *
 * @template T
 * @param {string} key namespaced storage key
 * @param {T} initialValue used when nothing is stored yet
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  const setPersisted = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      writeStorage(key, resolved);
      return resolved;
    });
  }, [key]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== key) return;
      setValue(readStorage(key, initialValue));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // `initialValue` is intentionally excluded: it is only a first-render default.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setPersisted];
}

export default useLocalStorage;
