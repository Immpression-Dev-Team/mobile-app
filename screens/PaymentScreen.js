import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createPaymentIntent } from "../API/API";
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from "./Template/ScreenTemplate";
import axios from "axios";
import { API_URL } from "../API_URL";

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, price } = route.params;
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();
  const { userData, setUserData, logout } = useAuth();
  const token = userData?.token;

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await createPaymentIntent(
        { orderId, price: Math.round(price * 100) },
        token
      );
      if (!response.clientSecret) {
        throw new Error("No client secret received from server");
      }
      console.log("response", response);

      const { error, paymentIntent } = await confirmPayment(
        response.clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: userData.name,
            },
          },
        }
      );
      console.log("paymentIntent", paymentIntent);
      console.log("error", error);

      if (error) {
        updateOrder("failed");
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        updateOrder("paid");
      }
    } catch (error) {
      updateOrder("failed");
      Alert.alert(
        "Error",
        error.response?.data?.error ||
        error.message ||
        "An error occurred while processing payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (status) => {
    try {
      await axios.put(
        `${API_URL}/order/${orderId}`,
        { status, transactionId: "123xyz" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === "paid") {
        navigation.replace("ReviewScreen", { orderId });
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.replace("DeliveryDetails", { orderId, price })}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.orderDetails}>
          <Text style={styles.header}>Payment Details</Text>
        </View>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeader}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${price.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>FREE</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${price.toFixed(2)}</Text>
          </View>
        </View>


        <View style={styles.cardContainer}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="lock-closed-outline" size={16} color="#777" style={{ marginRight: 6, marginTop: -10 }} />
            <Text style={styles.cardLabel}>Credit or Debit Card</Text>
          </View>

          <CardField
            postalCodeEnabled={false}
            placeholder={{ number: "4242 4242 4242 4242" }}
            cardStyle={{
              backgroundColor: "#F8F9FA",
              textColor: "#000000",
              borderRadius: 10,
              placeholderColor: "#A9A9A9",
            }}
            style={styles.cardField}
          />
        </View>

        <View style={{ width: "100%", marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePayment}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </ScreenTemplate>

  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginBottom: -20,
  },
  goBackButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  arrow: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  orderDetails: {
    marginLeft: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E2A3A",
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  cardLabel: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  cardField: {
    height: 50,
    width: "100%",
  },

  button: {
    backgroundColor: "#1E2A3A",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  buttonDisabled: {
    opacity: 0.7,
  },
  priceSection: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: "#EDEDED",
  },

  totalLabel: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },

  totalPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E2A3A",
  },
  priceCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  summaryHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2A3A",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },

  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  summaryDivider: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    marginVertical: 10,
  },

  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2A3A",
  },

  summaryTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2A3A",
  },


});

export default PaymentScreen;
