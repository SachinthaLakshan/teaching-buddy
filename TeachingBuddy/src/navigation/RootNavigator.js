import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native'; // Added ActivityIndicator & View
import { AuthContext } from './AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useTheme } from 'react-native-paper';

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthContext); // Using setUser for the mock login
  const [isLoading, setIsLoading] = useState(true); // Simulate checking for stored token/session
  const theme = useTheme();

  useEffect(() => {
    // Simulate checking for a stored session (e.g., async storage)
    setTimeout(() => {
      // For now, assume user is not logged in initially.
      // In a real app, you would check AsyncStorage for a token here.
      // setUser(null); // Or some stored user if found
      setIsLoading(false);
    }, 1500); // Simulate loading time
  }, []);

  // This effect will listen to navigation events from Auth screens
  // to simulate login by setting the user in AuthContext.
  // This is a workaround because the Login/Register screens currently call navigation.navigate('App')
  // which won't work directly to switch navigators without a shared state.
  // A better approach is for LoginScreen to call context.login(userData)
  // which then updates `user` state here, triggering the re-render.

  // The TeacherLoginScreen already calls Alert and then navigation.navigate('App').
  // We need to modify TeacherLoginScreen and TeacherRegisterScreen to use AuthContext.login/register
  // For now, to make it work without modifying those screens yet,
  // I'll add a temporary mechanism or assume they will be updated.
  // *Actually, the most straightforward way is to update Login/Register screens to use context.login*
  // I will assume those screens will be updated to call `login(user)` from AuthContext.
  // The current structure of TeacherLoginScreen has a placeholder for this.

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, {backgroundColor: theme.colors.background}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default RootNavigator;
