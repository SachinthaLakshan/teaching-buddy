import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from './services/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  return null;
} 