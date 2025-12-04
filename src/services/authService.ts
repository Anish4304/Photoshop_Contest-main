import api from './api';
import { transformUser } from '../utils/transformers';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  photographer?: any;
  judge?: any;
  message?: string;
}

// Photographer Authentication
export const photographerLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', { ...credentials, role: 'photographer' });
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userRole', 'photographer');
  }
  return data;
};

export const photographerRegister = async (registerData: RegisterData): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register/photographer', registerData);
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userRole', 'photographer');
  }
  return data;
};

// Judge Authentication
export const judgeLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', { ...credentials, role: 'judge' });
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userRole', 'judge');
  }
  return data;
};

// Get Current User
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  if (!token || !role) return null;

  try {
    if (role === 'photographer') {
      const { data } = await api.get('/photographers/profile');
      return transformUser(data.photographer || data.data, 'photographer');
    } else if (role === 'judge') {
      const { data } = await api.get('/judges/profile');
      return transformUser(data.judge || data.data, 'judge');
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    return null;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};
