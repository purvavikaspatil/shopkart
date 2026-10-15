import { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

const SettingsContext = createContext(null);

/** Defaults for a brand-new account. */
const DEFAULTS = {
  notifications: { email: true, sms: false, push: true, orderUpdates: true, priceDrops: true, deals: false },
  privacy: { publicProfile: false, personalisedRecommendations: true, activityTracking: true },
  language: 'English',
  currency: 'INR',
};

/** User preferences shown on /settings. Purely frontend, persisted locally. */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULTS);

  /** Updates one key inside a settings group, e.g. update('notifications', 'sms', true). */
  const update = useCallback((group, key, value) => {
    setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  }, [setSettings]);

  /** Updates a top-level scalar setting such as language or currency. */
  const set = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const reset = useCallback(() => setSettings(DEFAULTS), [setSettings]);

  const value = useMemo(() => ({ settings, update, set, reset }), [settings, update, set, reset]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
