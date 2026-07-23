import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

export default function StripeOptionalModal({ visible, onConnectStripe, onContinueWithout }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#bfd4f5", "#F5F9FF"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>Start selling today</Text>

          <Text style={styles.message}>
            You can list and sell your artwork without connecting Stripe. Your
            earnings will remain in your Immpression balance until you connect
            Stripe and withdraw them.
          </Text>

          <View style={styles.bulletWrapper}>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>🎨</Text>
              <Text style={styles.bulletText}>List artwork immediately — no Stripe required.</Text>
            </View>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>💰</Text>
              <Text style={styles.bulletText}>Earnings are held in your Immpression balance.</Text>
            </View>
            <View style={styles.bulletCard}>
              <Text style={styles.bulletIcon}>💳</Text>
              <Text style={styles.bulletText}>Connect Stripe only when you're ready to withdraw.</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Stripe is only required when you are ready to withdraw your earnings.
          </Text>

          <TouchableOpacity style={styles.primaryWrapper} onPress={onConnectStripe}>
            <LinearGradient colors={["#007bff", "#0056d2"]} style={styles.primaryButton}>
              <Text style={styles.primaryText}>Connect Stripe</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={onContinueWithout}>
            <Text style={styles.outlineText}>Continue Without Stripe</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E2A3A",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#2C3E50",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 16,
  },
  bulletWrapper: {
    width: "100%",
    gap: 8,
    marginBottom: 16,
  },
  bulletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: screenWidth * 0.75,
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
    fontSize: 13,
    fontWeight: "500",
    color: "#2C3E50",
    flexShrink: 1,
  },
  note: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 22,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  primaryWrapper: {
    width: "100%",
    borderRadius: 8,
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
  },
  outlineButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  outlineText: {
    color: "#635BFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
