
"use client";

import { User, users as initialUsers } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './use-toast';
import { useLoginUserMutation } from '@/services/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => Promise<any>;
  logout: () => void;
  register: (details: { name: string; email: string; avatar: string | null }) => boolean;
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
  const [loginUser] = useLoginUserMutation();

  useEffect(() => {
    try {
      const storedUserJson = localStorage.getItem('vault-user');
      const storedUsersJson = localStorage.getItem('vault-users');
      
      if (storedUserJson) {
        setUser(JSON.parse(storedUserJson));
      }
      if (storedUsersJson) {
        const parsedUsers = JSON.parse(storedUsersJson);
        const mappedUsers = parsedUsers.map((u: any) => ({ ...u, id: u._id || u.id }));
        setUsers(mappedUsers);
      } else {
        localStorage.setItem('vault-users', JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.setItem('vault-users', JSON.stringify(initialUsers));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUsers = (updatedUsers: User[]) => {
    const mappedUsers = updatedUsers.map((u: any) => ({ ...u, id: u._id || u.id }));
    setUsers(mappedUsers);
    localStorage.setItem('vault-users', JSON.stringify(mappedUsers));
    
    // Also update the current user's state if they were modified
    if (user) {
      const updatedCurrentUser = mappedUsers.find(u => u.id === user.id);
      if (updatedCurrentUser) {
        setUser(updatedCurrentUser);
        localStorage.setItem('vault-user', JSON.stringify(updatedCurrentUser));
      }
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) {
        // This handles the old mock login which is now deprecated
        toast({ title: "Please provide a password.", variant: "destructive" });
        return false;
    }
    
    try {
        const result = await loginUser({ email, password }).unwrap();
        const loggedInUser = { ...result.user, id: result.user._id };
        localStorage.setItem('vault-user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        // Update the list of users to include the full user object from DB
        const otherUsers = users.filter(u => u.id !== loggedInUser.id);
        const newUsers = [...otherUsers, loggedInUser];
        updateUsers(newUsers);

        if (loggedInUser.email === 'admin@vaulttalk.com') {
            router.push('/admin/dashboard');
        } else {
            router.push('/chat');
        }
        return result;
    } catch (err) {
        const apiError = err as any;
        const errorMessage = apiError?.data?.message || "An unknown error occurred during login.";
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return err;
    }
  };

  const logout = () => {
    localStorage.removeItem('vault-user');
    setUser(null);
    router.push('/');
  };

  const register = (details: { name: string; email: string, avatar: string | null }) => {
    const existingUser = users.find(u => u.email === details.email);
    if (existingUser) {
      return false; // User already exists
    }
    
    const newUser: User = {
      id: `${users.length + 1}`,
      name: details.name,
      email: details.email,
      avatar: details.avatar || `${(users.length % 5) + 1}`,
      avatarType: details.avatar ? 'custom' : 'placeholder',
      online: true,
      connections: [],
      blocked: [],
      connectionRequests: [],
    };

    const newUsers = [...users, newUser];
    updateUsers(newUsers);
    
    localStorage.setItem('vault-user', JSON.stringify(newUser));
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
