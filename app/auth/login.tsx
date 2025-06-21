import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native'; // Added Image
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../services/AuthContext';

// Assuming the logo path is correct relative to the project root for the 'require'
const logo = require('../../assets/images/partial-react-logo.png');

const TeacherLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { signin } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const success :any = await signin(email, password);
      if (success) {
        Alert.alert('Success', 'Login successful!');
        // Navigation to app routes will be handled by AuthContext effect or root layout logic
        // router.replace('/(tabs)/home'); // This can also be triggered here if preferred
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Teaching Buddy Login
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="lock" />}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={loading}
        disabled={loading}
        icon="login"
      >
        Login
      </Button>
      <Link href="/auth/register" asChild>
        <Button
          mode="text"
          style={styles.button}
          disabled={loading}
        >
          Don't have an account? Register
        </Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  logo: {
    width: 150,
    height: 100, // Adjust height as needed for the logo's aspect ratio
    alignSelf: 'center',
    marginBottom: 20,
  }
});

export default TeacherLoginScreen;
