import { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { seedNotifications } from '@/data/mockContent';

const NotificationsContext = createContext(null);

/** Notification centre. Seeded on first load so the page is never empty. */
export function NotificationsProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.notifications, seedNotifications);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, [setItems]);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setItems]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, [setItems]);

  const clearAll = useCallback(() => setItems([]), [setItems]);

  /** Pushes a new in-app notification, e.g. after an order is placed. */
  const push = useCallback((notification) => {
    setItems((prev) => [{
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      type: 'order',
      ...notification,
    }, ...prev]);
  }, [setItems]);

  const value = useMemo(
    () => ({ items, unreadCount, markRead, markAllRead, remove, clearAll, push }),
    [items, unreadCount, markRead, markAllRead, remove, clearAll, push],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}
