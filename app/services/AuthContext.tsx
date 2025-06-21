import AsyncStorage from '@react-native-async-storage/async-storage';
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
  isLoading: boolean;
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
    // Restore user and token from AsyncStorage on app startup
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        setUser(null);
        setToken(null);
      }
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
    }else{
      router.replace('/(tabs)/home');
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('token', data.token);
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
    }else{
      router.replace('/(tabs)/home');
    }
    // Optionally auto-login after signup
    await signin(email, password);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signin, signup, logout }}>
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
