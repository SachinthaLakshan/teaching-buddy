import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper'; // Removed PaperProvider, not needed here
import { users } from '../../data/dummyData';
import { AuthContext } from '../../navigation/AuthContext'; // Import AuthContext

const TeacherLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { login } = useContext(AuthContext); // Use login from AuthContext

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    // Simulate API call & login
    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        Alert.alert('Success', `Welcome back, ${user.name}!`);
        login(user); // Call login from context to update user state
        // No need for navigation.navigate('App') here, RootNavigator will handle the switch
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
      <Button
        mode="text"
        onPress={() => navigation.navigate('TeacherRegister')} // Navigation to Register screen is fine
        style={styles.button}
        disabled={loading}
      >
        Don't have an account? Register
      </Button>
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
});

// Wrap with PaperProvider if it's a standalone screen for testing,
// but typically PaperProvider is at the root of App.js
// export default TeacherLoginScreen;

// For now, let's export directly. App.js will have the Provider.
export default TeacherLoginScreen;
