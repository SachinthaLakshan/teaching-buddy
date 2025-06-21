import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/App/HomeScreen';
import MonthlyReportScreen from '../screens/App/MonthlyReportScreen';
import { useTheme, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'file-chart' : 'file-chart-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.backdrop, // A subtle top border
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabel: ({ focused, color }) => {
          // You can customize the label component further if needed
          // For example, using Paper's Text component for theming
          return <Text style={{ color, fontSize: 10, marginBottom: 2 }}>{route.name}</Text>;
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Daily Records' }}
      />
      <Tab.Screen
        name="Reports"
        component={MonthlyReportScreen}
        options={{ title: 'Monthly Reports' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
