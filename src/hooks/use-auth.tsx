
"use client";

import { User } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './use-toast';
import { useLoginUserMutation, useGetAllUsersQuery } from '@/services/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => Promise<any>;
  logout: () => void;
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

  const { data: allUsersFromApi, isSuccess: isUsersSuccess } = useGetAllUsersQuery(undefined, {
    skip: !user, // Don't fetch all users if no one is logged in
  });

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
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Once the user is logged in and the API call for all users succeeds,
    // update the local state to ensure it's in sync with the database.
    if(isUsersSuccess && allUsersFromApi) {
        updateUsers(allUsersFromApi);
    }
  }, [isUsersSuccess, allUsersFromApi]);


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

        // After login, the `useGetAllUsersQuery` will trigger,
        // and the useEffect above will handle updating the users list.

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
    localStorage.removeItem('vault-users'); // Clear all user data on logout
    setUser(null);
    setUsers([]);
    router.push('/');
  };

  const register = () => {
    // This is a placeholder as registration is handled by the register page mutation.
    return false;
  }

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUsers, isLoading }}>
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
