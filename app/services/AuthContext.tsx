import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, findUserByEmail, addUser as addNewUserToDB } from '../data/dummyData'; // Using dummyData
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

interface AuthContextType {
  user: User | null;
  login: (email: string, password_provided: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password_provided: string) => Promise<User | null>;
  isLoading: boolean; // To indicate if auth state is being determined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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


  const login = async (email: string, password_provided: string): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = findUserByEmail(email);
        if (foundUser && foundUser.password === password_provided) {
          setUser(foundUser);
          setIsLoading(false);
          // router.replace('/(tabs)/home'); // Navigation handled by useEffect
          resolve(true);
        } else {
          setUser(null);
          setIsLoading(false);
          resolve(false);
        }
      }, 500); // Simulate API delay
    });
  };

  const register = async (name: string, email: string, password_provided: string): Promise<User | null> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = findUserByEmail(email);
        if (existingUser) {
          setIsLoading(false);
          resolve(null); // User already exists
          return;
        }
        const newUser: User = { id: '', name, email, password: password_provided }; // ID will be set by addUser
        const addedUser = addNewUserToDB(newUser);
        setIsLoading(false);
        // Don't setUser here, user should login after registration
        // router.replace('/auth/login'); // Navigation handled by screen
        resolve(addedUser);
      }, 500);
    });
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate logout process
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        setIsLoading(false);
        // router.replace('/auth/login'); // Navigation handled by useEffect
        resolve();
      }, 300);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
