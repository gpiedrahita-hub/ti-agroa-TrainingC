'use client';

import React , { createContext , useContext , useEffect , useMemo , useState } from 'react';
import { UserInfo } from '@/types/user';

type AuthState = {
  mounted: boolean
  loading: boolean
  authenticated: boolean
  hasRole: (allowedRoles: string | string[]) => boolean;
  user: UserInfo | null
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(): Promise<{ authenticated: boolean; user: UserInfo | null }> {
  const res = await fetch('/api/auth/me' , {credentials: 'include' , cache: 'no-store'});
  if (!res.ok) return {authenticated: false , user: null};
  const data = (await res.json()) as UserInfo | null;
  return {authenticated: true , user: data ?? null};
}

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [mounted , setMounted] = useState(false);
  const [loading , setLoading] = useState(true);
  const [authenticated , setAuthenticated] = useState(false);
  const [user , setUser] = useState<UserInfo | null>(null);

  const refresh = async () => {
    setLoading(true);
    const {authenticated , user} = await fetchMe();
    setAuthenticated(authenticated);
    setUser(user);
    setLoading(false);
    setMounted(true);
  };

  const logout = async () => {
    await fetch('/api/auth/logout' , {method: 'POST' , credentials: 'include'});
    setAuthenticated(false);
    setUser(null);
  };

  const hasRole = (allowedRoles: string | string[]): boolean => {
    if (user) {
      if (!user?.role) return false;
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      return roles.includes(user.role.name);
    }
    return false;
  };

  useEffect(() => {
    refresh();
  } , []);

  const value = useMemo(
      () => ({mounted , loading , authenticated , hasRole , user , refresh , logout}) ,
      [mounted , loading , authenticated , hasRole , user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
