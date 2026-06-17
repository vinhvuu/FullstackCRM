"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@/types';

const MOCK_AUTH_STORAGE_KEY = 'vanhcorp_mock_admin';

function createMockAdmin(email?: string): AuthUser {
  return {
    id: 1,
    name: 'Quản trị viên',
    email: email?.trim() || 'admin@vanhcorp.local',
    role: 'admin',
    status: 'active',
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    const storedUser = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);

    if (!storedUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
      setUser(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    void password;
    const mockAdmin = createMockAdmin(email);
    window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(mockAdmin));
    setUser(mockAdmin);
  }

  async function logout() {
    window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    setUser(null);
  }

  async function refresh() {
    await checkAuth();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
