import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/theme/createAppTheme';
import { STORAGE_KEYS } from '@/utils/constants';
import { readStorage, writeStorage } from '@/utils/storage';

const ColorModeContext = createContext(null);

/** Reads the OS-level colour preference. */
function systemPrefersDark() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

/**
 * Theme provider supporting three settings: light, dark and system.
 * `preference` is what the user chose; `mode` is what is actually rendered.
 */
export function ColorModeProvider({ children }) {
  const [preference, setPreference] = useState(() => readStorage(STORAGE_KEYS.themeMode, 'system'));
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Track OS changes so "system" stays live rather than being read once.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const mode = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  const setMode = useCallback((next) => {
    setPreference(next);
    writeStorage(STORAGE_KEYS.themeMode, next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Keep the browser chrome (address bar on mobile) in step with the theme.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.palette.background.default);
  }, [theme]);

  const value = useMemo(
    () => ({ mode, preference, setMode, toggleMode, isDark: mode === 'dark' }),
    [mode, preference, setMode, toggleMode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

/** @returns {{mode:string, preference:string, setMode:Function, toggleMode:Function, isDark:boolean}} */
export function useColorMode() {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used inside <ColorModeProvider>');
  return ctx;
}
