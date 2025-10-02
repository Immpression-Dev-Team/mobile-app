// PaymentScreen.jsx
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

import {
  createPaymentIntent,
  getOrderShippingQuote,
  getOrderDetails,
  calculateTax,
  setOrderAmounts,
  finalizePayment, // ✅
} from "../API/API";
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from "./Template/ScreenTemplate";

const PLATFORM_FEE_RATE = 0.10; // 10%

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, price } = route.params; // price = item subtotal (USD number), fallback only
  const { confirmPayment } = useStripe();
  const { userData } = useAuth();
  const token = userData?.token;

  // order + address
  const [order, setOrder] = useState(null);
  const [fetchingOrder, setFetchingOrder] = useState(true);

  // shipping
  const [quoting, setQuoting] = useState(true);
  const [shipping, setShipping] = useState(null); // { amount, serviceName, ... }

  // tax (UI estimate; server persists definitive)
  const [taxing, setTaxing] = useState(false);
  const [taxCents, setTaxCents] = useState(0);

  // card UI state
  const [cardComplete, setCardComplete] = useState(false);

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
        if (!cancelled) Alert.alert("Error", "Unable to load order details.");
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
      try {
        const quote = await getOrderShippingQuote(orderId, token);
        if (!cancelled) {
          const cheapest = quote?.picks?.cheapest ?? quote?.pick ?? null;
          setShipping(quote?.success ? cheapest : null);

          // ✅ persist chosen shipping on the order (cents)
          if (quote?.success && cheapest?.amount != null) {
            const shippingCents = toCents(cheapest.amount);
            await setOrderAmounts(orderId, { shippingCents }, token);
          }
        }
      } catch (e) {
        console.error("getOrderShippingQuote failed:", e?.message || e);
      } finally {
        if (!cancelled) setQuoting(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, token]);

  // ---------- 3) Calculate tax for UI + persist on server ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!order?.deliveryDetails) return;
      if (shipping?.amount == null) return;

      const address = normalizeAddress(order.deliveryDetails);

      // Prefer server-sourced cents from the order; fallback to route param
      const baseCents =
        Number.isFinite(order?.baseAmount) ? Number(order.baseAmount)
        : Number.isFinite(order?.price)     ? Number(order.price)
        : toCents(price);

      const shippingCents = toCents(shipping.amount);

      setTaxing(true);
      try {
        // ✅ Pass orderId so backend persists taxAmount & totalAmount
        const res = await calculateTax(
          { baseCents, shippingCents, address, orderId },
          token
        );
        if (!cancelled) setTaxCents(Math.round(Number(res?.tax || 0)));
      } catch (e) {
        console.error("calculateTax failed:", e?.response?.data || e);
        if (!cancelled) setTaxCents(0);
      } finally {
        if (!cancelled) setTaxing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [order, shipping, price, token, orderId]);

  // Prefer amounts coming from the order (cents → USD) and fall back to route param
  const subtotal = useMemo(() => {
    if (Number.isFinite(order?.baseAmount)) return Number(order.baseAmount) / 100;
    if (Number.isFinite(order?.price)) return Number(order.price) / 100;
    return Number(price) || 0;
  }, [order, price]);

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

  const isPaid = (order?.status || "").toLowerCase() === "paid";

  async function handlePayment() {
    try {
      if (!token) return Alert.alert("Sign in required", "Please sign in to continue.");
      if (isPaid) return Alert.alert("Already paid", "This order has already been paid.");
      if (!order?.deliveryDetails) return Alert.alert("Missing address", "We couldn't load your delivery address.");
      if (!order?.artistStripeId) return Alert.alert("Seller not ready", "Artist is not connected to Stripe.");
      if (shipping?.amount == null) return Alert.alert("Shipping unavailable", "We couldn't get a shipping quote.");
      if (!cardComplete) return Alert.alert("Card incomplete", "Please complete your card details.");

      setLoading(true);

      // ensure shipping persisted (if user waited long and state changed)
      const shippingCents = toCents(shipping.amount);
      await setOrderAmounts(orderId, { shippingCents }, token);

      // compute platform fee from subtotal (item price only)
      const platformFeeCents = Math.round(toCents(subtotal) * PLATFORM_FEE_RATE);

      // ✅ Create PI — backend recomputes tax, saves all amounts to order, splits transfer
      const res = await createPaymentIntent({ orderId, platformFeeCents }, token);
      if (!res?.clientSecret) throw new Error("No client secret returned from server");

      // Confirm on-device
      const { error, paymentIntent } = await confirmPayment(res.clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: { billingDetails: { name: userData?.name || "Customer" } },
      });

      if (error) {
        Alert.alert("Payment failed", error.message);
        return;
      }

      const status = (paymentIntent?.status || "").toLowerCase();

      if (status === "succeeded") {
        // ✅ finalize on-device (webhook is still a fallback)
        try {
          await finalizePayment({ paymentIntentId: paymentIntent.id, orderId }, token);
        } catch (e) {
          console.warn("finalizePayment failed (will rely on webhook):", e?.message || e);
        }
        navigation.replace("ReviewScreen", { orderId });
      } else {
        Alert.alert("Payment submitted", "Your payment is processing. We’ll update your order shortly.");
        navigation.replace("ReviewScreen", { orderId });
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.error || err?.message || "An error occurred while processing payment."
      );
    } finally {
      setLoading(false);
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

          {!!order?.status && (
            <View style={[styles.statusPill, isPaid ? styles.statusPaid : styles.statusPending]}>
              <Text style={styles.statusText}>
                {String(order.status).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeader}>Order Summary</Text>

            <View>
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
              onCardChange={(d) => setCardComplete(!!d?.complete)}
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
                  shippingAmount == null ||
                  !token ||
                  !order ||
                  !cardComplete ||
                  isPaid) && styles.buttonDisabled,
              ]}
              onPress={handlePayment}
              disabled={
                loading ||
                quoting ||
                fetchingOrder ||
                taxing ||
                shippingAmount == null ||
                !token ||
                !order ||
                !cardComplete ||
                isPaid
              }
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>{isPaid ? "Already Paid" : "Pay Now"}</Text>
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
  // Backend expects: { line1, city, state, postal_code, country }
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
    gap: 10,
  },
  goBackButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  arrow: { fontSize: 18, color: "#333", fontWeight: "600" },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPending: { backgroundColor: "#f1f5f9" },
  statusPaid: { backgroundColor: "#16a34a22" },
  statusText: { fontSize: 12, color: "#111827", fontWeight: "700" },

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
