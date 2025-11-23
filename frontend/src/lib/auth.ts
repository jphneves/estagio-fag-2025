import api from './api';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: Array<{
    resource: string;
    action: string;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post('/api/auth/login', credentials);
    const { user, token } = response.data;
    
    // Salvar token no cookie
    Cookies.set('token', token, { expires: 7 });
    
    return { user, token };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post('/api/auth/register', data);
    const { user, token } = response.data;
    
    // Salvar token no cookie
    Cookies.set('token', token, { expires: 7 });
    
    return { user, token };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout() {
    Cookies.remove('token');
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  },

  hasPermission(user: User | null, resource: string, action: string): boolean {
    if (!user) return false;
    return user.permissions.some(
      p => p.resource === resource && p.action === action
    );
  },

  hasRole(user: User | null, role: string): boolean {
    if (!user) return false;
    return user.roles.includes(role);
  }
};
