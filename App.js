import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./state/AuthProvider";
import { guestStackScreen, userStackScreen } from "./utils/helpers";
import PaymentScreen from "./screens/PaymentScreen";
import { StripeProvider } from "@stripe/stripe-react-native";
import "react-native-get-random-values";

const STRIPE_KEY = "your-stripe-publishable-key"; // Replace with your Stripe publishable key

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
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StripeProvider publishableKey={STRIPE_KEY}>
          <AppContent />
        </StripeProvider>
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
