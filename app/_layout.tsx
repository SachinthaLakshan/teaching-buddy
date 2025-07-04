import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../services/AuthContext'; // Corrected path
import { appTheme } from '../theme/theme'; // Corrected path
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add other fonts here if your Paper theme uses them
  });

  useEffect(() => {
    if (isLoading || (!fontsLoaded && !fontError)) {
      // Still loading auth state or fonts
      return;
    }

    SplashScreen.hideAsync(); // Hide splash screen once everything is ready

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading, fontsLoaded, fontError, segments, router]);

  if (isLoading || (!fontsLoaded && !fontError)) {
    // You can return a dedicated loading screen here if needed
    // For now, returning null will keep the splash screen (or white screen if splash hidden too early)
    // A global loading indicator can also be placed here.
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={appTheme.colors.primary} />
        </View>
    );
  }

  // This layout structure assumes:
  // - Auth routes are in `app/auth/`
  // - Main app tabs are in `app/(tabs)/`
  // The useEffect above handles redirection.
  // The Stack navigator here just defines available routes at the root.
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  // The `useFonts` hook and other preliminary checks can be here or within InitialLayout.
  // For simplicity with SplashScreen, keeping font loading logic tied with auth loading.

  return (
    <AuthProvider>
      <PaperProvider theme={appTheme}>
        <StatusBar style="light" backgroundColor={appTheme.colors.primary} />
        <InitialLayout />
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appTheme.colors.background, // Or a specific splash screen like color
    }
  });
