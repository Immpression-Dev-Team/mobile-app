// screens/StripeGate.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";

import ScreenTemplate from "./Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import {
  createStripeAccount,
  checkStripeStatus as checkStripeStatusApi,
} from "../API/API";

const screenWidth = Dimensions.get("window").width;

export default function StripeGate() {
  const navigation = useNavigation();
  const route = useRoute();
  const nextScreen = route.params?.next || "SellGuide";

  const { userData } = useAuth();
  const token = userData?.token;
  const currentUserId = userData?.user?.user?._id;
  const userEmail = userData?.user?.user?.email;
  const userName = userData?.user?.user?.name;

  const [checking, setChecking] = useState(true);
  const [linking, setLinking] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Shine animation like your SellGuide
  const shineAnim = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [shineAnim]);
  const shineTranslate = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300],
  });

  const checkStatus = useCallback(async () => {
    if (!token) {
      Alert.alert("Login Required", "Please log in to continue.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }
    try {
      setChecking(true);
      const res = await checkStripeStatusApi(token);
      const done = !!res?.data?.onboarding_completed;
      setIsOnboarded(done);
      if (done) navigation.replace(nextScreen);
    } catch (e) {
      console.error("Stripe status check failed:", e?.response?.data || e);
    } finally {
      setChecking(false);
    }
  }, [token, navigation, nextScreen]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const startOnboarding = useCallback(async () => {
    if (!token) {
      Alert.alert("Login Required", "Please log in to continue.");
      return;
    }
    try {
      setLinking(true);
      const payload = { userId: currentUserId, userName, userEmail };
      const res = await createStripeAccount(payload, token); // expect { data: { url } }
      const url = res?.data?.url;
      if (!url) {
        Alert.alert("Stripe", "We couldn’t start Stripe onboarding. Try again.");
        return;
      }
      await WebBrowser.openBrowserAsync(url);
      await checkStatus();
      if (!isOnboarded) {
        Alert.alert(
          "Finish Onboarding",
          "Once you finish in Stripe, come back and tap 'I Completed Setup'."
        );
      }
    } catch (e) {
      console.error("Onboarding error:", e?.response?.data || e);
      Alert.alert("Stripe", "Could not start Stripe onboarding. Please try again.");
    } finally {
      setLinking(false);
    }
  }, [token, currentUserId, userName, userEmail, checkStatus, isOnboarded]);

  const confirmCompleted = useCallback(async () => {
    await checkStatus();
    if (isOnboarded) navigation.replace(nextScreen);
    else Alert.alert("Still Not Linked", "Stripe isn’t linked yet. Please finish onboarding.");
  }, [checkStatus, isOnboarded, navigation, nextScreen]);

  return (
    <ScreenTemplate>
      <View style={styles.outerContainer}>
        <LinearGradient
          colors={["#bfd4f5", "#F5F9FF"]}
          style={styles.innerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="clip">
            Link Stripe to Sell on Immpression
          </Text>

          {/* Visual panel with subtle shine */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/stripe-logo.png")}
              style={styles.guideImage}
              resizeMode="contain"
            />
            <Animated.View
              style={[styles.shine, { transform: [{ translateX: shineTranslate }] }]}
            />
          </View>

          <Text style={styles.instructions}>Before you upload your art for sale:</Text>

          <View style={styles.bulletWrapper}>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>💸</Text>
              <Text style={styles.bulletText}>Connect a Stripe account to receive payouts.</Text>
            </View>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>✅</Text>
              <Text style={styles.bulletText}>Complete Stripe’s required verification.</Text>
            </View>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>🛡️</Text>
              <Text style={styles.bulletText}>Protect buyers and sellers with secure processing.</Text>
            </View>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={startOnboarding}
            disabled={checking || linking}
          >
            <LinearGradient colors={["#007bff", "#0056d2"]} style={styles.primaryButton}>
              <Text style={styles.primaryText}>
                {linking ? "Opening Stripe…" : "Link Stripe Now"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary CTA */}
          <TouchableOpacity
            style={[styles.outlineButton]}
            onPress={confirmCompleted}
            disabled={checking || linking}
          >
            <Text style={styles.outlineText}>I Completed Setup</Text>
          </TouchableOpacity>

          {/* Ghost CTA */}
          {/* <TouchableOpacity
            style={[styles.ghostButton]}
            onPress={() => navigation.navigate("Profile")}
            disabled={checking || linking}
          >
            <Text style={styles.ghostText}>Open Profile (Link from there)</Text>
          </TouchableOpacity> */}
        </LinearGradient>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1E2A3A",
    textAlign: "center",
    width: "100%",
  },
  imageContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 160,
    overflow: "hidden",
    marginVertical: 20,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  guideImage: {
    width: "50%",
    height: "50%",
  },
  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: "100%",
    backgroundColor: "white",
    opacity: 0.25,
    transform: [{ rotate: "20deg" }],
    zIndex: 2,
  },
  instructions: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
    textAlign: "center",
  },
  bulletWrapper: {
    width: "100%",
    gap: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  bulletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: screenWidth * 0.8,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bulletIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C3E50",
    flexShrink: 1,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    elevation: 2,
    marginBottom: 10,
  },
  primaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  outlineButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#3D31FF",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  outlineText: {
    color: "#3D31FF",
    fontSize: 15,
    fontWeight: "700",
  },
  ghostButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  ghostText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "600",
  },
});
