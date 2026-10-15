import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { authService } from '@/services';
import { STORAGE_KEYS } from '@/utils/constants';
import { readStorage, writeStorage, removeStorage } from '@/utils/storage';

const AuthContext = createContext(null);

/**
 * Mock session state.
 * The session ({ user, token }) is mirrored into localStorage so a refresh
 * keeps you signed in, exactly as a real token would.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStorage(STORAGE_KEYS.auth, null));
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  // Short boot pass so protected routes do not flash the login page on refresh.
  useEffect(() => {
    setSession(readStorage(STORAGE_KEYS.auth, null));
    setBooting(false);
  }, []);

  const persist = useCallback((next) => {
    setSession(next);
    if (next) writeStorage(STORAGE_KEYS.auth, next);
    else removeStorage(STORAGE_KEYS.auth);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      persist(result);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const signup = useCallback(async (payload) => {
    setLoading(true);
    try {
      const result = await authService.signup(payload);
      persist(result);
      return result.user;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(async () => {
    await authService.logout();
    persist(null);
  }, [persist]);

  const updateUser = useCallback(async (updates) => {
    if (!session?.user) return null;
    const updated = await authService.updateProfile(session.user.id, updates);
    persist({ ...session, user: updated });
    return updated;
  }, [session, persist]);

  /** Marks the current user's email as verified after a successful OTP check. */
  const markVerified = useCallback(() => {
    if (!session?.user) return;
    persist({ ...session, user: { ...session.user, emailVerified: true } });
  }, [session, persist]);

  const value = useMemo(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.user),
    loading,
    booting,
    login,
    signup,
    logout,
    updateUser,
    markVerified,
  }), [session, loading, booting, login, signup, logout, updateUser, markVerified]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** @returns {{user:object|null, isAuthenticated:boolean, login:Function, signup:Function, logout:Function}} */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
