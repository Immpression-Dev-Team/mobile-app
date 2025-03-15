import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenExpired } from "../utils/authUtils";
import {IP} from "../API_URL";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userResponse");
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);

          if (parsedData.token && isTokenExpired(parsedData.token)) {
            console.log("Token expired. Refreshing...");
            const refreshedUserData = await refreshToken(parsedData.token);
            if (refreshedUserData) {
              setUserData(refreshedUserData);
            } else {
              await logout();
            }
          } else {
            setUserData(parsedData);
          }
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const refreshToken = async (oldToken) => {
    try {
      const response = await fetch(`http://${IP}:4000/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: oldToken }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedUserData = { ...userData, token: data.token };
        await AsyncStorage.setItem("userResponse", JSON.stringify(updatedUserData));
        return updatedUserData;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return null;
  };

  const login = async (data) => {
    await AsyncStorage.setItem("userResponse", JSON.stringify(data));
    setUserData(data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userResponse");
    setUserData(null);
  };

  const token = userData ? userData.token : null;

  return (
      <AuthContext.Provider value={{ userData, setUserData, logout, login, loading, token }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
