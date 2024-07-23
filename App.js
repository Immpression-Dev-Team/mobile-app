import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/Home";
import StatisticsScreen from "./screens/Statistics";
import GalleryScreen from "./screens/Gallery";
import SettingsScreen from "./screens/Settings";
import LoginScreen from "./screens/Login";
import SignUpScreen from "./screens/SignUp";
import ProfileScreen from "./screens/Profile";
import ImageScreen from "./components/ImageScreen";
import PasswordReset from "./screens/PasswordReset";
import ArtistScreen from "./components/ArtistScreens";
import { AuthProvider, useAuth } from "./state/AuthProvider";
import Upload from "./screens/Upload";

const Stack = createStackNavigator();

const AppContent = () => {
  const { userData, loading } = useAuth();
  console.log(userData);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userData ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ImageScreen" component={ImageScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
          <Stack.Screen name="ArtistScreens" component={ArtistScreen} />
          <Stack.Screen name="Upload" component={Upload} />
        </>
      ) : (
       <>
       <Stack.Screen name="Login" component={LoginScreen} />
       <Stack.Screen name="SignUp" component={SignUpScreen} />
       <Stack.Screen name="PasswordReset" component={PasswordReset} />
       </>
        
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
