import { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, MAX_RECENTLY_VIEWED } from '@/utils/constants';

const RecentlyViewedContext = createContext(null);

/** Most-recent-first list of viewed product ids, capped and persisted. */
export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useLocalStorage(STORAGE_KEYS.recentlyViewed, []);

  const record = useCallback((productId) => {
    setIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_RECENTLY_VIEWED));
  }, [setIds]);

  const remove = useCallback((productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, [setIds]);

  const clear = useCallback(() => setIds([]), [setIds]);

  const value = useMemo(() => ({ ids, count: ids.length, record, remove, clear }), [ids, record, remove, clear]);

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used inside <RecentlyViewedProvider>');
  return ctx;
}
