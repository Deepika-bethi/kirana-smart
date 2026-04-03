import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'shopkeeper' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const getStoredUsers = (): (User & { password: string })[] => {
  const data = localStorage.getItem('six_users');
  return data ? JSON.parse(data) : [];
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
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, role: UserRole): boolean => {
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email, password, role };
    localStorage.setItem('six_users', JSON.stringify([...users, newUser]));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
