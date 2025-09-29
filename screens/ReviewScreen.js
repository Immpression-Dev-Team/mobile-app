import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../state/AuthProvider";
import { API_URL } from "../API_URL";
import ScreenTemplate from "./Template/ScreenTemplate";

const BRAND = "#1E2A3A";

const centsToDollars = (cents) => (cents == null ? null : Number(cents) / 100);
const money = (n) => (n == null || Number.isNaN(Number(n)) ? "—" : `$${Number(n).toFixed(2)}`);

const ReviewScreen = ({ route }) => {
  const { orderId, amounts } = route.params || {};
  const { userData } = useAuth();
  const token = userData?.token;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch order (details + fallback numbers)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/orderDetails/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res?.data?.data || res?.data?.order || res?.data;
        if (!cancelled) setOrder(data || null);
      } catch (e) {
        Alert.alert("Error", "Failed to fetch order details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, token]);

  if (loading) {
    return (
      <ScreenTemplate>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenTemplate>
    );
  }

  if (!order) {
    return (
      <ScreenTemplate>
        <View style={styles.centered}>
          <Text style={{ color: "#333" }}>No order details found.</Text>
          <Text style={styles.helpText}>Need help? Contact immpression.nyc@gmail.com</Text>
        </View>
      </ScreenTemplate>
    );
  }

  const delivery = order?.deliveryDetails || {};
  const createdAt = order?.createdAt ? new Date(order.createdAt) : null;

  // Prefer route params; fallback to order fields (either dollars or *Cents)
  const subtotal =
    amounts?.subtotal ??
    order?.price ??
    centsToDollars(order?.priceCents);

  const shipping =
    amounts?.shipping ??
    order?.shippingAmount ??
    centsToDollars(order?.shippingCents);

  const tax =
    amounts?.tax ??
    order?.tax ??
    centsToDollars(order?.taxCents);

  const total =
    amounts?.total ??
    order?.total ??
    centsToDollars(order?.totalCents) ??
    (Number(subtotal || 0) + Number(shipping || 0) + Number(tax || 0));

  const statusLabel = (() => {
    const s = (order?.status || "").toLowerCase();
    if (s === "paid") return "Paid";
    if (s === "processing") return "Processing";
    if (s === "shipped") return "Shipped";
    if (s === "delivered") return "Delivered";
    if (s === "failed") return "Payment Failed";
    return order?.status || "—";
  })();

  const statusStyle = (() => {
    const s = (order?.status || "").toLowerCase();
    if (s === "paid") return { bg: "#E7F5EE", fg: "#1B7F4E" };
    if (s === "processing") return { bg: "#F1F5FF", fg: "#365FDB" };
    if (s === "shipped") return { bg: "#FFF6E5", fg: "#A05A00" };
    if (s === "delivered") return { bg: "#E8FBF0", fg: "#0B7D53" };
    if (s === "failed") return { bg: "#FDECEC", fg: "#B3261E" };
    return { bg: "#EEE", fg: "#555" };
  })();

  return (
    <ScreenTemplate>
      <ScrollView>
        {/* Minimal header (no icons) */}
        <View style={styles.headerBar}>
          <Text style={styles.title}>Order Review</Text>
        </View>

        <View style={styles.wrapper}>
          {/* Receipt / status card */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.orderId}>
                  Order #{String(order?._id || "").slice(-8).toUpperCase()}
                </Text>
                {!!createdAt && (
                  <Text style={styles.muted}>
                    Placed on {createdAt.toLocaleDateString()}
                  </Text>
                )}
              </View>

              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.fg }]}>{statusLabel}</Text>
              </View>
            </View>

            {order?.imageLink ? (
              <View style={styles.previewRow}>
                <Image source={{ uri: order.imageLink }} style={styles.previewImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {order?.artName || "Artwork"}
                  </Text>
                  <Text style={styles.muted} numberOfLines={1}>
                    by {order?.artistName || "Artist"}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {order?.artName || "Artwork"}
                </Text>
                <Text style={styles.muted} numberOfLines={1}>
                  by {order?.artistName || "Artist"}
                </Text>
              </View>
            )}
          </View>

          {/* Delivery card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Delivery Details</Text>
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Address</Text>
              <Text style={styles.kvVal} numberOfLines={2}>
                {delivery?.address || "—"}
              </Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>City</Text>
              <Text style={styles.kvVal}>{delivery?.city || "—"}</Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>State</Text>
              <Text style={styles.kvVal}>{delivery?.state || "—"}</Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Zip Code</Text>
              <Text style={styles.kvVal}>{delivery?.zipCode || "—"}</Text>
            </View>
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Country</Text>
              <Text style={styles.kvVal}>{delivery?.country || "—"}</Text>
            </View>
          </View>

          {/* Order summary */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Item</Text>
              <Text style={styles.summaryValue}>{money(Number(subtotal || 0))}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping == null ? "—" : money(Number(shipping))}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {tax == null ? "—" : money(Number(tax))}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                {total == null ? "—" : money(Number(total))}
              </Text>
            </View>
          </View>

          {/* Tracking badge */}
          <View style={styles.actionRow}>
            {order?.trackingNumber ? (
              <View style={[styles.trackBadge, { borderColor: "#E0E0E0" }]}>
                <Ionicons name="cube-outline" size={16} color="#555" />
                <Text style={styles.trackText} numberOfLines={1}>
                  Tracking: {order.trackingNumber}
                </Text>
              </View>
            ) : (
              <View style={[styles.trackBadge, { borderColor: "#E0E0E0" }]}>
                <Ionicons name="time-outline" size={16} color="#555" />
                <Text style={styles.trackText}>Awaiting shipment</Text>
              </View>
            )}
          </View>

          <View style={{ alignItems: "center", marginTop: 6 }}>
            <Text style={styles.helpText}>
              Need help? Contact immpression.nyc@gmail.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: BRAND,
  },

  wrapper: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: { fontSize: 14, fontWeight: "700", color: "#333" },
  muted: { fontSize: 12, color: "#7A7A7A", marginTop: 2 },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  itemName: { fontSize: 15, fontWeight: "600", color: "#1E2A3A" },

  cardHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E2A3A",
    marginBottom: 10,
  },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  kvKey: { fontSize: 13, color: "#555" },
  kvVal: {
    fontSize: 13,
    color: "#333",
    maxWidth: "60%",
    textAlign: "right",
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
  summaryTotalLabel: { fontSize: 16, fontWeight: "700", color: "#1E2A3A" },
  summaryTotalValue: { fontSize: 16, fontWeight: "800", color: "#1E2A3A" },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 4,
    marginBottom: 8,
  },
  trackBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  trackText: { fontSize: 13, color: "#333", fontWeight: "500" },

  helpText: { fontSize: 12, color: "#6B7280" },
});

export default ReviewScreen;
