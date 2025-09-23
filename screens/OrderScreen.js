import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenTemplate from "./Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import { getMyOrders, getMySales, refreshTrackingForOrder } from "../API/API";

export default function OrderScreen({ navigation }) {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("buyer"); // "buyer" | "seller"
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshingMap, setRefreshingMap] = useState({}); // orderId -> boolean

  // ---- helpers ----
  const fmtMoney = (n) => {
    const num = Number(n || 0);
    return `$${num.toFixed(2)}`;
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const fmtDateTime = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const mapHighLevelStatus = (raw) => {
    const s = String(raw || "").toLowerCase();
    if (s.includes("deliver")) return "Delivered";
    if (s.includes("out_for_delivery")) return "Out for delivery";
    if (s.includes("transit")) return "In transit";
    if (s.includes("ship")) return "Shipped";
    if (s.includes("paid")) return "Paid";
    return "Ordered";
  };

  const statusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("deliver") && !s.includes("out")) return "#10B981"; // green
    if (s.includes("out for delivery")) return "#22C55E";
    if (s.includes("transit")) return "#3B82F6"; // blue
    if (s.includes("ship")) return "#6366F1"; // indigo
    return "#6B7280"; // gray
  };

  // newest tracking event (by datetime if present, else last item)
  const getLatestEvent = (events) => {
    if (!Array.isArray(events) || events.length === 0) return null;
    const withDates = events
      .map((e) => {
        const t = e?.datetime ? new Date(e.datetime) : null;
        return { ...e, __ts: t && !isNaN(t.getTime()) ? t.getTime() : null };
      })
      .sort((a, b) => {
        // put valid datetimes first (desc)
        if (a.__ts && b.__ts) return b.__ts - a.__ts;
        if (a.__ts && !b.__ts) return -1;
        if (!a.__ts && b.__ts) return 1;
        return 0;
      });
    return withDates[0];
  };

  // ---- data fetch ----
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      // Fetch both buyer and seller orders in parallel
      const [buyerRes, sellerRes] = await Promise.all([
        getMyOrders(token, 1, 50),
        getMySales(token, 1, 50).catch(() => ({ data: [] })) // Fallback if endpoint doesn't exist yet
      ]);

      // Process buyer orders
      const buyerList = Array.isArray(buyerRes?.data) ? buyerRes.data : [];
      const buyers = buyerList.map((o) => {
        const shipping = o?.shipping || {};
        const events = Array.isArray(shipping.trackingEvents)
          ? shipping.trackingEvents
          : [];

        const latestEvent = getLatestEvent(events);

        // Choose a human status: prefer shipmentStatus, else order.status
        const highStatus =
          mapHighLevelStatus(shipping.shipmentStatus) ||
          mapHighLevelStatus(o.status);

        return {
          id: o._id || o.id,
          title: o.artName || o.artworkTitle || "Artwork",
          artistName: o.artistName || "Unknown",
          price: o.price || 0,
          date: o.createdAt || o.orderDate,
          orderStatus: highStatus, // high-level
          image: o.imageLink || o.imageUrl || null,

          // shipping bits
          carrier: shipping.carrier || null,
          tracking: shipping.trackingNumber || null,
          shipmentStatus: shipping.shipmentStatus || null,
          latestEvent: latestEvent
            ? {
              message: latestEvent.message || latestEvent.status || "",
              when: latestEvent.datetime || null,
              location: latestEvent.location || "",
            }
            : null,
        };
      });

      // Process seller orders
      const sellerList = Array.isArray(sellerRes?.data) ? sellerRes.data : [];
      const sellers = sellerList.map((o) => {
        const tracking = o?.tracking || {};

        return {
          id: o._id || o.id,
          title: o.artName || o.artworkTitle || "Artwork",
          artistName: o.buyerName || "Customer", // For seller view, show buyer name
          price: o.price || 0,
          date: o.createdAt || o.orderDate,
          orderStatus: mapHighLevelStatus(tracking.shipmentStatus || o.status), // Use shipmentStatus from tracking
          image: o.imageLink || o.imageUrl || null,
          tracking: tracking.trackingNumber || null,
          carrier: tracking.carrier || null,
          shipmentStatus: tracking.shipmentStatus || o.status || "processing",
          shippedAt: tracking.shippedAt || null,
          deliveredAt: tracking.deliveredAt || null,
          trackingEvents: tracking.trackingEvents || [],
        };
      });

      setBuyerOrders(buyers);
      setSellerOrders(sellers);
    } catch (e) {
      setError(e?.message || "Failed to load orders");
      setBuyerOrders([]);
      setSellerOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // manual tracking refresh (buyer or seller)
  const onRefreshTracking = async (orderId) => {
    if (!orderId || !token) return;
    try {
      setRefreshingMap((m) => ({ ...m, [orderId]: true }));
      await refreshTrackingForOrder(token, orderId); // calls /tracking/refresh-user/:id
      await fetchOrders(); // re-pull with updated status/events
    } catch (e) {
      setError(e?.message || "Failed to refresh tracking");
    } finally {
      setRefreshingMap((m) => ({ ...m, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchOrders);
    return unsub;
  }, [navigation]);

  // ---- UI ----
  const BuyerOrderCard = ({ order }) => {
    const hasTracking = !!order.tracking;
    const derivedStatus =
      mapHighLevelStatus(order.shipmentStatus) || order.orderStatus;

    return (
      <View style={styles.card} key={order.id}>
        <View style={styles.cardHeader}>
          {order.image ? (
            <Image source={{ uri: order.image }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
              <Text style={styles.placeholderIcon}>🎨</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {order.title}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor(derivedStatus)}15`, borderColor: statusColor(derivedStatus) }
              ]}>
                <Text style={[styles.statusText, { color: statusColor(derivedStatus) }]}>
                  {derivedStatus}
                </Text>
              </View>
            </View>

            <Text style={styles.artistName} numberOfLines={1}>
              by {order.artistName}
            </Text>

            <View style={styles.orderMeta}>
              <Text style={styles.orderDate}>Ordered {fmtDate(order.date)}</Text>
              <Text style={styles.price}>{fmtMoney(order.price)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Shipping state */}
        {!hasTracking ? (
          <View style={styles.shippingSection}>
            <View style={styles.shippingNotice}>
              <View style={styles.shippingIcon}>
                <Text style={styles.shippingEmoji}>⏳</Text>
              </View>
              <View style={styles.shippingContent}>
                <Text style={styles.shippingTitle}>Awaiting Shipment</Text>
                <Text style={styles.shippingText}>
                  The seller will add tracking information once your order ships.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.shippingSection}>
            <View style={[styles.shippingNotice, styles.shippingNoticeActive]}>
              <View style={[styles.shippingIcon, styles.shippingIconActive]}>
                <Text style={styles.shippingEmoji}>📦</Text>
              </View>
              <View style={styles.shippingContent}>
                <Text style={styles.shippingTitle}>
                  {order.carrier ? `${order.carrier} ` : ""}#{order.tracking}
                </Text>
                {order.latestEvent ? (
                  <Text style={styles.shippingText} numberOfLines={2}>
                    {order.latestEvent.message || "Package in transit"}
                    {order.latestEvent.when && ` • ${fmtDateTime(order.latestEvent.when)}`}
                    {order.latestEvent.location && ` • ${order.latestEvent.location}`}
                  </Text>
                ) : (
                  <Text style={styles.shippingText}>
                    Tracking label created — awaiting pickup scan
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const SellerOrderCard = ({ order }) => {
    const hasTracking = !!order.tracking;

    return (
      <View style={styles.card} key={order.id}>
        <View style={styles.cardHeader}>
          {order.image ? (
            <Image source={{ uri: order.image }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
              <Text style={styles.placeholderIcon}>🎨</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {order.title}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor(order.shipmentStatus || "processing")}15`, borderColor: statusColor(order.shipmentStatus || "processing") }
              ]}>
                <Text style={[styles.statusText, { color: statusColor(order.shipmentStatus || "processing") }]}>
                  {order.shipmentStatus || "Processing"}
                </Text>
              </View>
            </View>

            <Text style={styles.artistName} numberOfLines={1}>
              Sold to {order.artistName}
            </Text>

            <View style={styles.orderMeta}>
              <Text style={styles.orderDate}>Sold {fmtDate(order.date)}</Text>
              <Text style={styles.price}>{fmtMoney(order.price)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Shipping Action */}
        <View style={styles.shippingSection}>
          {!hasTracking ? (
            <TouchableOpacity
              style={styles.addTrackingButton}
              onPress={() =>
                navigation.navigate("SubmitTrackingNumber", {
                  orderData: {
                    orderId: order.id,
                    artName: order.title,
                    artistName: order.artistName,
                    price: order.price,
                    imageLink: order.image,
                  },
                })
              }
            >
              <View style={styles.trackingButtonContent}>
                <View style={styles.trackingButtonIcon}>
                  <Text style={styles.trackingButtonEmoji}>📦</Text>
                </View>
                <View style={styles.trackingButtonText}>
                  <Text style={styles.trackingButtonTitle}>Add Tracking Number</Text>
                  <Text style={styles.trackingButtonSubtext}>Ship this order to the customer</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.shippingNotice, styles.shippingNoticeActive]}>
              <View style={[styles.shippingIcon, styles.shippingIconActive]}>
                <Text style={styles.shippingEmoji}>✅</Text>
              </View>
              <View style={styles.shippingContent}>
                <Text style={styles.shippingTitle}>
                  {order.carrier ? `${order.carrier} ` : ""}#{order.tracking}
                </Text>
                <Text style={styles.shippingText}>
                  {order.shipmentStatus || "Shipped"}
                </Text>
                <View style={{ marginTop: 6, flexDirection: "row", justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    onPress={() => onRefreshTracking(order.id)}
                    disabled={!!refreshingMap[order.id]}
                    style={[styles.refreshBtn, refreshingMap[order.id] && { opacity: 0.6 }]}
                  >
                    <Text style={styles.refreshBtnText}>
                      {refreshingMap[order.id] ? "Refreshing…" : "Refresh tracking"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const ListBlock = ({ title, orders, role }) => {
    return (
      <View style={styles.block}>
        <Text style={styles.blockTitle}>{title}</Text>

        {loading ? (
          <View style={styles.centerPad}>
            <ActivityIndicator size="small" color="#635BFF" />
            <Text style={styles.dim}>Loading…</Text>
          </View>
        ) : error ? (
          <View style={styles.centerPad}>
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retry} onPress={fetchOrders}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.centerPad}>
            <Text style={styles.dim}>
              {role === "buyer" ? "No orders yet." : "No sales yet."}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ maxHeight: 600 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {orders.map((o) =>
              role === "buyer" ? (
                <BuyerOrderCard key={o.id} order={o} />
              ) : (
                <SellerOrderCard key={o.id} order={o} />
              )
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>Purchases & Sales</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab("buyer")}
            style={[styles.tab, activeTab === "buyer" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "buyer" && styles.tabTextActive,
              ]}
            >
              🛒 Buyer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("seller")}
            style={[styles.tab, activeTab === "seller" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "seller" && styles.tabTextActive,
              ]}
            >
              💰 Seller
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "buyer" ? (
          <ListBlock title="Your Purchases" orders={buyerOrders} role="buyer" />
        ) : (
          <ListBlock title="Your Sales" orders={sellerOrders} role="seller" />
        )}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E2A3A",
    textAlign: "center",
  },
  headerSub: { textAlign: "center", color: "#6B7280", marginTop: 4 },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 6,
    gap: 6,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#635BFF" },
  tabText: { fontWeight: "700", color: "#4B5563" },
  tabTextActive: { color: "#fff" },

  block: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    padding: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: "cover",
  },
  thumbPlaceholder: {
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  placeholderIcon: {
    fontSize: 24,
    color: "#9CA3AF",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },
  artistName: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  orderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#635BFF"
  },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 12,
  },

  // Shipping Section
  shippingSection: {
    padding: 12,
  },
  shippingNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  shippingNoticeActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  shippingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  shippingIconActive: {
    backgroundColor: "#DBEAFE",
  },
  shippingEmoji: {
    fontSize: 14,
  },
  shippingContent: {
    flex: 1,
  },
  shippingTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 1,
  },
  shippingText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 14,
  },

  // Add Tracking Button
  addTrackingButton: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    padding: 12,
  },
  trackingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackingButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  trackingButtonEmoji: {
    fontSize: 14,
    color: "#fff",
  },
  trackingButtonText: {
    flex: 1,
  },
  trackingButtonTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 1,
  },
  trackingButtonSubtext: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },

  // Status Row for shipped orders
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  centerPad: { alignItems: "center", paddingVertical: 28, gap: 8 },
  dim: { color: "#6B7280" },

  error: { color: "#DC2626", fontWeight: "700", marginBottom: 8 },
  retry: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "700" },

  refreshBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },

});
