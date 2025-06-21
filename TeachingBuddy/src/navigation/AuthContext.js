import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in, user object means logged in

  const login = (userData) => {
    // In a real app, you'd get a token, user profile, etc.
    // For dummy data, we simulate setting the user from dummyData.js
    // The actual user object comes from the login screen's logic.
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData) => {
    // After successful registration, the user usually needs to login
    // So, we don't set user here, or we could auto-login them.
    // For this app, we'll just navigate to login after register.
    console.log('User registered:', userData.email);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
