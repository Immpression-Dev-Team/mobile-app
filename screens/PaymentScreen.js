import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import axios from "axios";

import {
  createPaymentIntent,
  getOrderShippingQuote,
  getOrderDetails,
  calculateTax,
} from "../API/API";
import { API_URL } from "../API_URL";
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from "./Template/ScreenTemplate";

const PLATFORM_FEE_RATE = 0.10; // <- adjust your policy here (10% of item price)

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, price } = route.params; // price = item subtotal in USD (number)
  const { confirmPayment } = useStripe();
  const { userData } = useAuth();
  const token = userData?.token;

  // order + address
  const [order, setOrder] = useState(null);
  const [fetchingOrder, setFetchingOrder] = useState(true);

  // shipping
  const [quoting, setQuoting] = useState(true);
  const [shipping, setShipping] = useState(null); // { amount, serviceName, ... }

  // tax (for UI display; server will still recompute)
  const [taxing, setTaxing] = useState(false);
  const [taxCents, setTaxCents] = useState(0);

  // pay
  const [loading, setLoading] = useState(false);

  // ---------- 1) Fetch order ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setFetchingOrder(true);
      try {
        const res = await getOrderDetails(orderId, token);
        if (!cancelled && res?.success) setOrder(res.data);
      } catch (e) {
        console.error("getOrderDetails failed:", e?.message || e);
      } finally {
        if (!cancelled) setFetchingOrder(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, token]);

  // ---------- 2) Quote shipping ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setQuoting(true);
      const quote = await getOrderShippingQuote(orderId, token);
      if (!cancelled) {
        const cheapest = quote?.picks?.cheapest ?? quote?.pick ?? null;
        setShipping(quote?.success ? cheapest : null);
        setQuoting(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, token]);

  // ---------- 3) Calculate tax for UI (server will recompute anyway) ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!order?.deliveryDetails) return;
      if (shipping?.amount == null) return;

      const address = normalizeAddress(order.deliveryDetails);
      const baseCents = toCents(price);
      const shippingCents = toCents(shipping.amount);

      setTaxing(true);
      try {
        const res = await calculateTax({ baseCents, shippingCents, address }, token);
        if (!cancelled) {
          setTaxCents(Math.round(Number(res?.tax || 0)));
        }
      } catch (e) {
        console.error("calculateTax failed:", e?.response?.data || e);
        if (!cancelled) setTaxCents(0);
      } finally {
        if (!cancelled) setTaxing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [order, shipping, price, token]);

  const subtotal = Number(price) || 0;
  const shippingAmount = shipping?.amount != null ? Number(shipping.amount) : null;
  const taxAmount = taxCents / 100;

  const totalDisplay = useMemo(() => {
    if (shippingAmount == null) return "—";
    const t = subtotal + shippingAmount + taxAmount;
    return `$${t.toFixed(2)}`;
  }, [subtotal, shippingAmount, taxAmount]);

  const taxDisplay =
    taxing || fetchingOrder || quoting
      ? "Calculating…"
      : `$${(Number.isFinite(taxAmount) ? taxAmount : 0).toFixed(2)}`;

  async function handlePayment() {
    try {
      if (!order?.deliveryDetails) {
        Alert.alert("Missing address", "We couldn't load your delivery address.");
        return;
      }
      if (!order?.artistStripeId) {
        Alert.alert("Seller not ready", "Artist is not connected to Stripe.");
        return;
      }
      if (shipping?.amount == null) {
        Alert.alert("Shipping unavailable", "We couldn't get a shipping quote.");
        return;
      }

      setLoading(true);

      const baseCents = toCents(subtotal);
      const shippingCents = toCents(shipping.amount);
      const platformFeeCents = Math.round(baseCents * PLATFORM_FEE_RATE);
      const address = normalizeAddress(order.deliveryDetails);

      // Create PI (server recomputes tax and sets the split automatically)
      const res = await createPaymentIntent(
        {
          orderId,
          sellerStripeId: order.artistStripeId,
          baseCents,
          shippingCents,
          address,
          platformFeeCents,
        },
        token
      );

      if (!res?.clientSecret) {
        throw new Error("No client secret returned from server");
      }

      // Confirm on-device
      const { error, paymentIntent } = await confirmPayment(res.clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: { name: userData?.name || "Customer" },
        },
      });

      if (error) {
        await updateOrder("failed");
        Alert.alert("Payment failed", error.message);
        return;
      }

      if (paymentIntent) {
        await updateOrder("paid");
      }
    } catch (err) {
      await updateOrder("failed");
      Alert.alert(
        "Error",
        err?.response?.data?.error || err?.message || "An error occurred while processing payment."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateOrder(status) {
    try {
      await axios.put(
        `${API_URL}/order/${orderId}`,
        { status, transactionId: "pi-client" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === "paid") {
        navigation.replace("ReviewScreen", { orderId });
      }
    } catch (e) {
      console.error("Failed to update order:", e);
    }
  }

  return (
    <ScreenTemplate>
      <ScrollView>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.replace("DeliveryDetails", { orderId, price })}
          >
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeader}>Order Summary</Text>

            <View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View className="summaryRow" style={styles.summaryRow}>
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
                <Text style={styles.summaryValue}>{taxDisplay}</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{totalDisplay}</Text>
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
                (loading ||
                  quoting ||
                  fetchingOrder ||
                  taxing ||
                  shippingAmount == null) &&
                  styles.buttonDisabled,
              ]}
              onPress={handlePayment}
              disabled={
                loading || quoting || fetchingOrder || taxing || shippingAmount == null
              }
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

/* -------------------- helpers -------------------- */

function toCents(n) {
  return Math.round(Number(n || 0) * 100);
}

function normalizeAddress(delivery) {
  // Your backend normAddr looks for: { line1, city, state, postal_code, country }
  return {
    line1: String(delivery?.address || "").slice(0, 200),
    city: delivery?.city || "",
    state: delivery?.state || "",
    postal_code: delivery?.zipCode || "",
    country: delivery?.country === "United States" ? "US" : delivery?.country || "US",
  };
}

/* -------------------- styles -------------------- */

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
  arrow: { fontSize: 18, color: "#333", fontWeight: "600" },

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
  summaryLabel: { fontSize: 14, color: "#555" },
  summaryValue: { fontSize: 14, color: "#333", fontWeight: "500" },
  summaryDivider: { borderBottomWidth: 1, borderColor: "#E0E0E0", marginVertical: 10 },
  summaryTotalLabel: { fontSize: 16, fontWeight: "600", color: "#1E2A3A" },
  summaryTotalValue: { fontSize: 16, fontWeight: "700", color: "#1E2A3A" },

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
  cardLabelRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardLabel: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardField: { height: 50, width: "100%" },
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
  buttonDisabled: { opacity: 0.7 },
});

export default PaymentScreen;
