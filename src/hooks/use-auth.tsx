
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
  const [users, setUsers] = useState<User[]>([]);
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
        // Fallback to initial mock data if nothing in local storage
        const mappedInitialUsers = initialUsers.map((u: any) => ({ ...u, id: u._id || u.id }));
        setUsers(mappedInitialUsers);
        localStorage.setItem('vault-users', JSON.stringify(mappedInitialUsers));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      const mappedInitialUsers = initialUsers.map((u: any) => ({ ...u, id: u._id || u.id }));
      setUsers(mappedInitialUsers);
      localStorage.setItem('vault-users', JSON.stringify(mappedInitialUsers));
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
        toast({ title: "Please provide a password.", variant: "destructive" });
        return false;
    }
    
    try {
        const result = await loginUser({ email, password }).unwrap();
        const loggedInUser = { ...result.user, id: result.user._id };
        localStorage.setItem('vault-user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        // On login, we trust the database. Replace the local user list with DB users.
        // For now, since we don't have a GET /users endpoint that returns full objects,
        // we'll just update the logged-in user in the existing list.
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
    // This function is now effectively deprecated in favor of the register API endpoint.
    // The logic is handled by the register page itself.
    // We keep it here to avoid breaking other parts of the app that might still reference it.
    console.warn("Legacy register function called. This should be handled by the register page mutation.");
    return false;
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
