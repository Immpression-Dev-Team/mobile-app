import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../state/AuthProvider";
import { checkStripeStatus as checkStripeStatusApi } from "../API/API";

const FooterNavbar = () => {
  const navigation = useNavigation();
  const { userData, token } = useAuth();
  const [checkingStripe, setCheckingStripe] = useState(false);

  const go = (screen) => navigation.navigate(screen);

  const handlePressSell = useCallback(async () => {
    if (!token) {
      Alert.alert("Login Required", "Please log in to sell artwork.", [
        { text: "Cancel", style: "cancel" },
        { text: "Go to Login", onPress: () => go("Login") },
      ]);
      return;
    }
    try {
      setCheckingStripe(true);
      const res = await checkStripeStatusApi(token);
      const isOnboarded = !!res?.data?.onboarding_completed;
      if (isOnboarded) go("SellGuide");
      else navigation.navigate("StripeGate", { next: "SellGuide" });
    } catch (e) {
      console.error("Stripe status check failed:", e?.response?.data || e);
      navigation.navigate("StripeGate", { next: "SellGuide" });
    } finally {
      setCheckingStripe(false);
    }
  }, [token, navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => go("Home")}>
        <Icon name="home" size={24} color="#635BFF" style={styles.icon} />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePressSell} disabled={checkingStripe}>
        <Icon name="sell" size={24} color="#635BFF" style={styles.icon} />
        <Text style={styles.text}>{checkingStripe ? "Checking…" : "Sell"}</Text>
      </TouchableOpacity>

      {/* Show Login button for guests, Profile button for authenticated users */}
      {token ? (
        <TouchableOpacity style={styles.button} onPress={() => go("Profile")}>
          <Icon name="person" size={24} color="#635BFF" style={styles.icon} />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => go("Login")}>
          <Icon name="login" size={24} color="#635BFF" style={styles.icon} />
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  button: { alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 16, flex: 1 },
  icon: { marginBottom: 4 },
  text: { color: "#635BFF", fontSize: 11, textAlign: "center", fontWeight: "600", letterSpacing: 0.5 },
});

export default FooterNavbar;
