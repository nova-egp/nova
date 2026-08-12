import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthSession } from '@/types';
import * as authApi from '@/api/auth';

interface AuthContextValue {
  session: AuthSession | null;
  login: (phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (params: {
    fullName: string;
    phone: string;
    password: string;
    email?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    // In local dev this makes sure the documented demo admin account
    // exists before we read the session; it's a no-op in production
    // builds (see ensureDevAdminAccount).
    authApi.ensureDevAdminAccount().finally(() => {
      setSession(authApi.getSession());
    });
  }, []);

  const value: AuthContextValue = {
    session,
    login: async (phone, password) => {
      const res = await authApi.login({ phone, password });
      if (res.ok) {
        setSession(res.session);
        return { ok: true };
      }
      return { ok: false, error: res.error };
    },
    register: async (params) => {
      const res = await authApi.register(params);
      if (res.ok) {
        setSession(res.session);
        return { ok: true };
      }
      return { ok: false, error: res.error };
    },
    logout: () => {
      authApi.logout();
      setSession(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
