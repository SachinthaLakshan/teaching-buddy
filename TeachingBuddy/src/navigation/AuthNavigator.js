import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherLoginScreen from '../screens/Auth/TeacherLoginScreen';
import TeacherRegisterScreen from '../screens/Auth/TeacherRegisterScreen';
import { useTheme } from 'react-native-paper';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false, // We will hide this for a cleaner look on auth screens
      }}
    >
      <Stack.Screen
        name="TeacherLogin"
        component={TeacherLoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="TeacherRegister"
        component={TeacherRegisterScreen}
        options={{ title: 'Register' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
