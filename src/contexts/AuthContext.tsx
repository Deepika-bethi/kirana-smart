import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api';

export type UserRole = 'shopkeeper' | 'customer';

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (credential: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('six_current_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('six_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('six_current_user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await api.post('/auth/signup', { name, email, password, role });
      const { user: userData, token } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (credential: string, role: UserRole) => {
    try {
      const decoded: any = jwtDecode(credential);
      const googleData = {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: role
      };

      const response = await api.post('/auth/google', googleData);
      const { user: userData, token } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
