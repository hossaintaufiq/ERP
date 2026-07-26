'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './api';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  companyId?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('ge_access_token');
    const u = localStorage.getItem('ge_user');
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        /* ignore */
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res: any = await authApi.login(email, password);
    localStorage.setItem('ge_access_token', res.accessToken);
    localStorage.setItem('ge_refresh_token', res.refreshToken);
    localStorage.setItem('ge_user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('ge_access_token');
    localStorage.removeItem('ge_refresh_token');
    localStorage.removeItem('ge_user');
    setToken(null);
    setUser(null);
    authApi.logout().catch(() => undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
