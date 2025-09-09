// components/NotificationDropdown.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { formatNotification } from "../utils/notificationFormat";

export default function NotificationDropdown({
  notifications = [],
  onClose,
  onPressItem,
  refreshing = false,
  onRefresh,
  onLoadMore,
  footerLoading = false,
  markAllRead,
}) {
  const renderItem = ({ item }) => {
    const isUnread = !item.readAt;
    const fmt = formatNotification(item);

    const accentStyle =
      fmt.accent === "success"
        ? styles.successCard
        : fmt.accent === "warning"
        ? styles.warningCard
        : null;

    return (
      <Pressable
        style={[styles.notificationCard, isUnread && styles.unreadCard, accentStyle]}
        onPress={() => onPressItem?.(item)}
      >
        <View style={styles.row}>
          <Icon name={fmt.icon} size={20} color="#333" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              {!!fmt.title && <Text style={styles.title}>{fmt.title}</Text>}
              {fmt.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{fmt.badge}</Text>
                </View>
              )}
            </View>
            {!!fmt.message && <Text style={styles.notificationText}>{fmt.message}</Text>}
            <View style={styles.metaRow}>
              <Text style={styles.timeText}>{fmt.time}</Text>
              {isUnread && <View style={styles.dot} />}
            </View>
          </View>
          {fmt.imageUrl ? (
            <Image source={{ uri: fmt.imageUrl }} style={styles.thumb} resizeMode="cover" />
          ) : null}
        </View>
      </Pressable>
    );
  };

  // Robust key extractor: prefer _id, then id, then a composed fallback
  const keyExtractor = (item, index) =>
    String(item._id || item.id || item.uuid || item.notificationId || index);

  // Guard onEndReached so it doesn't spam while loading/refreshing
  const handleEndReached = () => {
    if (!footerLoading && !refreshing) {
      onLoadMore?.();
    }
  };

  return (
    <View style={styles.dropdown}>
      <View style={styles.topBar}>
        {markAllRead && notifications.length > 0 && (
          <Pressable style={styles.roundBtn} onPress={markAllRead}>
            <Text style={styles.roundBtnText}>Mark all as read</Text>
          </Pressable>
        )}
        <Pressable style={styles.roundBtn} onPress={onClose}>
          <Text style={styles.roundBtnText}>Close</Text>
        </Pressable>
      </View>

      <FlatList
        data={Array.isArray(notifications) ? notifications : []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.35}
        onEndReached={handleEndReached}
        // Force re-render when the array reference changes or read states update
        extraData={notifications}
        // A few stability/perf tweaks for small lists in a constrained dropdown
        initialNumToRender={8}
        windowSize={3}
        removeClippedSubviews={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet</Text>}
        ListFooterComponent={
          footerLoading ? (
            <View style={{ paddingVertical: 8 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 6 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 60,
    right: 15,
    width: 320,
    maxHeight: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 6,
  },
  roundBtn: {
    backgroundColor: "#F1F3F8",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  roundBtnText: { fontSize: 12, color: "#333", fontWeight: "600" },

  notificationCard: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 8,
    marginBottom: 4,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  icon: { marginRight: 8, marginTop: 2 },

  unreadCard: { backgroundColor: "#F4F8FF" },
  successCard: { borderLeftWidth: 3, borderLeftColor: "#28A745", backgroundColor: "#E8F5E8" },
  warningCard: { borderLeftWidth: 3, borderLeftColor: "#FF9800", backgroundColor: "#FFF5E5" },

  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 14, fontWeight: "700", color: "#222" },
  badge: { backgroundColor: "#222", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  notificationText: { fontSize: 14, color: "#333", marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  timeText: { fontSize: 12, color: "#888" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#3B82F6" },
  thumb: { width: 40, height: 40, borderRadius: 6, marginLeft: 8 },
  emptyText: { fontSize: 14, color: "#888", textAlign: "center", marginVertical: 10 },
});
