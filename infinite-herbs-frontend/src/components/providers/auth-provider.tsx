'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { UserInfo } from '@/types/user';
import { authService } from '@/services/auth/authService';
import type { LoginRequest } from '@/types/user';

type AuthState = {
  mounted: boolean;
  loading: boolean;
  authenticated: boolean;
  user: UserInfo | null;
  hasRole: (allowedRoles: string | string[]) => boolean;
  refresh: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function readAuthFromToken(): { authenticated: boolean; user: UserInfo | null } {
  const authenticated = authService.isAuthenticated();
  const user = authenticated ? authService.getCurrentUser() : null;
  return { authenticated: authenticated && !!user, user };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ authenticated, user }, setAuth] = useState(() => readAuthFromToken());
  const [mounted] = useState(true);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setAuth(readAuthFromToken());
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    await authService.login(credentials);
    setAuth(readAuthFromToken());
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuth({ authenticated: false, user: null });
  }, []);

  const hasRole = useCallback(
      (allowedRoles: string | string[]): boolean => {
        if (!user?.role) return false;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        return roles.includes(user.role.name);
      },
      [user]
  );

  const value = useMemo(
      () => ({ mounted, loading, authenticated, user, hasRole, refresh, login, logout }),
      [mounted, loading, authenticated, user, hasRole, refresh, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}