import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { users, addTeachingRecord } from '../../data/dummyData'; // To add new user to mock data
import { AuthContext } from '../../navigation/AuthContext'; // Import AuthContext

const TeacherRegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { register } = useContext(AuthContext); // Use register from AuthContext

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    // Simulate API call & registration
    setTimeout(() => {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        Alert.alert('Registration Failed', 'This email is already registered.');
      } else {
        const newUser = {
          id: `user${users.length + 1}`, // simple ID
          name,
          email,
          // Storing plain password in dummyData for login simulation.
          // In a real app, hash this password before sending to a backend.
          password: password,
        };
        // users.push(newUser); // Add to our mock data - AuthContext's register might handle this or a service
        register(newUser); // Call context's register

        // Add user to the dummyData.users array manually for now for persistence in this mock setup
        // In a real app this would be handled by a backend and the context might fetch updated user list
        if (!users.find(u => u.email === newUser.email)) {
            users.push(newUser);
        }

        Alert.alert('Success', 'Registration successful! Please login.');
        navigation.navigate('TeacherLogin'); // Navigate to login after registration
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Teacher Registration
      </Text>
      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
      />
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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        left={<TextInput.Icon icon="lock-check" />}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        loading={loading}
        disabled={loading}
        icon="account-plus"
      >
        Register
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('TeacherLogin')}
        style={styles.button}
        disabled={loading}
      >
        Already have an account? Login
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

export default TeacherRegisterScreen;
