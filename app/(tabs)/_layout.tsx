import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Import Text from react-native-paper if you want to use its theming for labels more directly,
// or rely on tintColor passed by the navigator.
// import { Text as PaperText } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme(); // Using react-native-paper theme

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled, // A more muted color for inactive tabs
        // headerShown: true, // We can show headers per tab screen if needed
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2, // Or theme.colors.surface for a flatter look
          borderTopColor: theme.colors.outlineVariant, // Subtle top border
          borderTopWidth: StyleSheet.hairlineWidth, // Use StyleSheet for hairlineWidth
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'reports') {
            iconName = focused ? 'file-chart' : 'file-chart-outline';
          } else if (route.name === 'lessonPlans') {
            iconName = focused ? 'notebook-edit' : 'notebook-edit-outline'; // Icon for Lesson Plans
          }
          // It's important that MaterialCommunityIcons is available.
          // @expo/vector-icons should provide it.
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        // Example for custom label styling with PaperText:
        // tabBarLabel: ({ focused, color }) => (
        //   <PaperText style={{ color, fontSize: 10, marginBottom: 2, fontFamily: theme.fonts.labelSmall.fontFamily }}>
        //     {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
        //   </PaperText>
        // ),
      })}
    >
      <Tabs.Screen
        name="home" // This should match the filename app/(tabs)/home.tsx
        options={{
          title: 'Daily Records',
          // tabBarIcon is handled by screenOptions, but can be overridden here
        }}
      />
      <Tabs.Screen
        name="reports" // This should match the filename app/(tabs)/reports.tsx
        options={{
          title: 'Monthly Reports',
          // tabBarIcon is handled by screenOptions
        }}
      />
      <Tabs.Screen
        name="lessonPlans" // This should match the filename app/(tabs)/lessonPlans.tsx
        options={{
          title: 'Lesson Plans',
        }}
      />
    </Tabs>
  );
}

// Need to import StyleSheet for hairlineWidth
import { StyleSheet } from 'react-native';

