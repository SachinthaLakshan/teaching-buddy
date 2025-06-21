import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const BASE_URL = 'https://teach-buddy-be.vercel.app';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();


  useEffect(() => {
    // This effect runs when navigationState.key changes, indicating navigator is ready
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)'; // Assuming auth routes are in an (auth) group

    if (!user && !inAuthGroup && !isLoading) {
      console.log("User not authenticated, not in auth group, redirecting to login.");
      router.replace('/auth/login');
    } else if (user && inAuthGroup && !isLoading) {
      console.log("User authenticated, in auth group, redirecting to home.");
      router.replace('/(tabs)/home');
    }
    // If isLoading is true, we don't do anything yet, waiting for auth state determination
  }, [user, segments, navigationState?.key, isLoading, router]);


  useEffect(() => {
    // Simulate checking for a stored session on app startup
    const checkUserSession = async () => {
      setIsLoading(true);
      // In a real app, you'd check AsyncStorage or secure store here
      // For now, assume no user is logged in initially
      setUser(null);
      setIsLoading(false);
    };
    checkUserSession();
  }, []);


  const signin = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error('Invalid credentials');
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch(`${BASE_URL}/api/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (res.status === 409) {
      throw new Error('User already exists');
    }
    if (!res.ok) {
      throw new Error('Signup failed');
    }
    // Optionally auto-login after signup
    await signin(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
