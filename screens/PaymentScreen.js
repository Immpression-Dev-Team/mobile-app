// PaymentScreen.js
import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
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
import { createPaymentIntent, getOrderShippingQuote } from "../API/API";
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from "./Template/ScreenTemplate";
import axios from "axios";
import { API_URL } from "../API_URL";

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, price } = route.params; // price = item subtotal (USD)
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(true);
  const [shipping, setShipping] = useState(null); // { amount, serviceName, ... }
  const { confirmPayment } = useStripe();
  const { userData } = useAuth();
  const token = userData?.token;

  // Fetch shipping quote on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setQuoting(true);
      const quote = await getOrderShippingQuote(orderId, token);
      if (!cancelled) {
        // Support either { pick } (current shipping-quote endpoint)
        // or { picks: { cheapest } } (if server later aligns with /shipping/ups-rates)
        const cheapest = quote?.picks?.cheapest ?? quote?.pick ?? null;
        setShipping(quote?.success ? cheapest : null);
        setQuoting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, token]);

  const handlePayment = async () => {
    try {
      if (shipping?.amount == null) {
        Alert.alert(
          "Shipping unavailable",
          "We couldn't get a shipping quote. Please try again."
        );
        return;
      }

      setLoading(true);

      const shippingCents = Math.round(Number(shipping.amount) * 100);
      const subtotalCents = Math.round(Number(price) * 100);
      const totalCents = subtotalCents + shippingCents;

      const response = await createPaymentIntent(
        { orderId, price: totalCents },
        token
      );
      if (!response.clientSecret) {
        throw new Error("No client secret received from server");
      }

      const { error, paymentIntent } = await confirmPayment(
        response.clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: userData?.name || "Customer",
            },
          },
        }
      );

      if (error) {
        await updateOrder("failed");
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        await updateOrder("paid");
      }
    } catch (error) {
      await updateOrder("failed");
      Alert.alert(
        "Error",
        error?.response?.data?.error ||
          error?.message ||
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

  const subtotal = Number(price) || 0;
  const shippingAmount =
    shipping?.amount != null ? Number(shipping.amount) : null;
  const total =
    shippingAmount != null ? (subtotal + shippingAmount).toFixed(2) : "—";

  return (
    <ScreenTemplate>
      <ScrollView>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() =>
              navigation.replace("DeliveryDetails", { orderId, price })
            }
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
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Shipping{shipping?.serviceName ? ` (${shipping.serviceName})` : ""}
              </Text>
              <Text style={styles.summaryValue}>
                {quoting
                  ? "Calculating…"
                  : shippingAmount != null
                  ? `$${shippingAmount.toFixed(2)}`
                  : "—"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{total}</Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardLabelRow}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#777"
                style={{ marginRight: 6, marginTop: -10 }}
              />
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
              style={[
                styles.button,
                (loading || quoting || shippingAmount == null) &&
                  styles.buttonDisabled,
              ]}
              onPress={handlePayment}
              disabled={loading || quoting || shippingAmount == null}
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
      </ScrollView>
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
  formWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
  cardLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
});

export default PaymentScreen;
