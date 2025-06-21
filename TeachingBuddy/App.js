import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from './src/navigation/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { theme as appTheme } from './src/theme/theme'; // Your custom theme
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

// Optional: Ignore specific logs if they are noisy and not critical
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']); // Example

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={appTheme}>
        <StatusBar style="light" backgroundColor={appTheme.colors.primary} />
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}

// No need for StyleSheet here anymore as RootNavigator handles the UI.
// If you need global styles not covered by PaperProvider theme, you might add them.
