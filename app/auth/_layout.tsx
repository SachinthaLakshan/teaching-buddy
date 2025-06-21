import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function AuthLayout() {
  const theme = useTheme(); // In case you want to theme the navigator itself

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Individual screens can set their own titles if needed via <Stack.Screen options={{title: "..."}} />
        // contentStyle: { backgroundColor: theme.colors.background } // Apply background to navigator if screens don't cover
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
