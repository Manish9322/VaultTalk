"use client";

import { User, users as initialUsers } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string) => boolean;
  logout: () => void;
  register: (details: { name: string; email: string }) => boolean;
  updateUsers: (updatedUsers: User[]) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUserJson = localStorage.getItem('whisper-user');
      const storedUsersJson = localStorage.getItem('whisper-users');
      
      if (storedUserJson) {
        setUser(JSON.parse(storedUserJson));
      }
      if (storedUsersJson) {
        setUsers(JSON.parse(storedUsersJson));
      } else {
        localStorage.setItem('whisper-users', JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.setItem('whisper-users', JSON.stringify(initialUsers));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('whisper-users', JSON.stringify(updatedUsers));
    
    // Also update the current user's state if they were modified
    if (user) {
      const updatedCurrentUser = updatedUsers.find(u => u.id === user.id);
      if (updatedCurrentUser) {
        setUser(updatedCurrentUser);
        localStorage.setItem('whisper-user', JSON.stringify(updatedCurrentUser));
      }
    }
  };

  const login = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      localStorage.setItem('whisper-user', JSON.stringify(foundUser));
      setUser(foundUser);
      if (foundUser.email === 'admin@whisper.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/chat');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    const wasAdmin = user?.email === 'admin@whisper.com';
    localStorage.removeItem('whisper-user');
    setUser(null);
    // For simplicity, we're not resetting the whole user list on logout
    // In a real app, you might refetch or clear this data
    router.push(wasAdmin ? '/admin' : '/');
  };

  const register = (details: { name: string; email: string }) => {
    const existingUser = users.find(u => u.email === details.email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `${users.length + 1}`,
      name: details.name,
      email: details.email,
      avatar: `${(users.length % 5) + 1}`,
      online: true,
      connections: [],
      blocked: [],
      connectionRequests: [],
    };
    const newUsers = [...users, newUser];
    updateUsers(newUsers);
    
    localStorage.setItem('whisper-user', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/chat');
    return true;
  }

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, updateUsers, isLoading }}>
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
