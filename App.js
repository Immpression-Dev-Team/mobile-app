import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./state/AuthProvider";
import { guestStackScreen, userStackScreen } from "./utils/helpers";
import PaymentScreen from "./screens/PaymentScreen";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ensureAdsInitialized } from "./utils/ads";
import "react-native-get-random-values";

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
  useEffect(() => {
    // Fires the ATT prompt (iOS) as early as possible, then initializes the
    // AdMob SDK, so both are done by the time any ad component requests an ad.
    ensureAdsInitialized();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <StripeProvider
          publishableKey={
            "pk_live_51QSkxdKdKw1LKdPsgCBuTZnWZBJHXq7tjN5e3M9zHFjASwVd1QizY8O2eswoZeNCKfMUJYX5awVxtpxWElgXqlA600gtAz0hwy"
          }
        >
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
