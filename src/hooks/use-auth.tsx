"use client";

import { User, users } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('whisper-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      localStorage.setItem('whisper-user', JSON.stringify(foundUser));
      setUser(foundUser);
      router.push('/chat');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('whisper-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
