
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, authClient } from '@/lib/auth-client';
import { api } from '../utils/api';

interface UserProfile {
  skills: string[];
  industry: string;
  experienceLevel: string;
  bio: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'guest' | 'user' | 'admin';
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile> & { name?: string }) => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Better Auth handles session, user state, and loading automatically
  const { data: session, isPending: loading, refetch } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);

  // Extract the current user object from session data or fallback to offline demo user
  const currentUser: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role || 'user',
        profile: dbProfile || {
          skills: [],
          industry: '',
          experienceLevel: '',
          bio: '',
        },
      }
    : (typeof window !== 'undefined' && localStorage.getItem('token') === 'mock_jwt_token_demo_user'
      ? {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'sharifulamin1111@gmail.com',
          role: 'user',
          profile: dbProfile || {
            skills: ['React', 'Node.js'],
            industry: 'Technology',
            experienceLevel: 'Intermediate',
            bio: 'This is a demo profile running in offline mode.',
          }
        }
      : null);

  // Sync Better Auth session token to localStorage and fetch profile
  useEffect(() => {
    const syncAndFetch = async () => {
      const currentToken = localStorage.getItem('token');
      
      // If we have a Better Auth session
      if (session?.session?.token) {
        const token = session.session.token;
        localStorage.setItem('token', token);
        
        try {
          const res = await api.auth.getProfile();
          if (res.success && res.user && res.user.profile) {
            setDbProfile(res.user.profile);
          }
        } catch (err) {
          console.error('Error fetching user profile from server:', err);
        }
      } 
      // If no Better Auth session, but we have a demo user token
      else if (currentToken === 'mock_jwt_token_demo_user') {
        // Retain the demo profile settings locally if any, or don't reset
      } 
      // Otherwise, clear any stale token/profile
      else {
        if (currentToken) {
          localStorage.removeItem('token');
        }
        setDbProfile(null);
      }
    };

    if (!loading) {
      syncAndFetch();
    }
  }, [session, loading]);

  // Route guard for protected pages
  useEffect(() => {
    if (!loading) {
      const isDashboardRoute = pathname?.startsWith('/dashboard');
      if (isDashboardRoute && !currentUser) {
        toast.error('Please login to access the dashboard');
        router.push('/login');
      }
    }
  }, [currentUser, loading, pathname, router]);

  // Login action with Better Auth
  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }

    toast.success('Welcome back!');
    router.push('/dashboard');
  };

  // Register action with Better Auth
  const register = async (name: string, email: string, password: string) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }

    toast.success('Registration successful!');
    router.push('/dashboard');
  };

  // Logout action with Better Auth
  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          localStorage.removeItem('token');
          toast.success('Logged out successfully');
          router.push('/login');
        },
      },
    });
  };

  // Update profile handler (Optional customization using authClient.updateUser)
  const updateProfile = async (profileData: Partial<UserProfile> & { name?: string }) => {
    try {
      if (profileData.name) {
        await authClient.updateUser({ name: profileData.name });
      }
      
      const res = await api.auth.updateProfile({
        name: profileData.name,
        skills: profileData.skills,
        industry: profileData.industry,
        experienceLevel: profileData.experienceLevel,
        bio: profileData.bio
      });

      if (res.success) {
        toast.success('Profile updated successfully');
        if (res.user && res.user.profile) {
          setDbProfile(res.user.profile);
        }
        refetch();
      } else {
        throw new Error(res.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const refreshUser = async () => {
    refetch();
    try {
      const res = await api.auth.getProfile();
      if (res.success && res.user && res.user.profile) {
        setDbProfile(res.user.profile);
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
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