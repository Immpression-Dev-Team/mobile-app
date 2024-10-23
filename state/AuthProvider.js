import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem('userResponse');
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (data) => {
    await AsyncStorage.setItem('userResponse', JSON.stringify(data));
    setUserData(data);
  };
  const logout = async () => {
    await AsyncStorage.removeItem('userResponse');
    setUserData(null);
  };

  const token = userData ? userData.token : null;

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, logout, login, loading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
