import React, { lazy } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./state/AuthProvider";
import { guestStackScreen, userStackScreen } from "./utils/helpers";
import 'react-native-get-random-values';

const Stack = createStackNavigator();

const AppContent = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userData ? userStackScreen() : guestStackScreen()}
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
};

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
