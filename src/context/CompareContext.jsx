import { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, MAX_COMPARE_ITEMS } from '@/utils/constants';

const CompareContext = createContext(null);

/** Product comparison tray, capped at MAX_COMPARE_ITEMS so the table stays readable. */
export function CompareProvider({ children }) {
  const [ids, setIds] = useLocalStorage(STORAGE_KEYS.compare, []);

  const isComparing = useCallback((productId) => ids.includes(productId), [ids]);
  const isFull = ids.length >= MAX_COMPARE_ITEMS;

  const add = useCallback((productId) => {
    let added = false;
    setIds((prev) => {
      if (prev.includes(productId) || prev.length >= MAX_COMPARE_ITEMS) return prev;
      added = true;
      return [...prev, productId];
    });
    return added;
  }, [setIds]);

  const remove = useCallback((productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, [setIds]);

  /** @returns {'added'|'removed'|'full'} what happened, so the caller can toast accordingly */
  const toggle = useCallback((productId) => {
    if (ids.includes(productId)) { remove(productId); return 'removed'; }
    if (ids.length >= MAX_COMPARE_ITEMS) return 'full';
    add(productId);
    return 'added';
  }, [ids, add, remove]);

  const clear = useCallback(() => setIds([]), [setIds]);

  const value = useMemo(() => ({
    ids, count: ids.length, isFull, max: MAX_COMPARE_ITEMS,
    isComparing, add, remove, toggle, clear,
  }), [ids, isFull, isComparing, add, remove, toggle, clear]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
  return ctx;
}
