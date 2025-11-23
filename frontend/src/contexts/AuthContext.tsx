'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/lib/auth';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { user: loggedUser } = await authService.login({ email, password });
    setUser(loggedUser);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  function hasPermission(resource: string, action: string): boolean {
    return authService.hasPermission(user, resource, action);
  }

  function hasRole(role: string): boolean {
    return authService.hasRole(user, role);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
