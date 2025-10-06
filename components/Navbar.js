// components/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { View, Image, Pressable, StyleSheet, Animated, Text } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import logoImg from "../assets/Logo_T.png";
import { useNavigation, StackActions } from "@react-navigation/native";
import LongSearchBar from "./LongSearchBar";
import LogoTitle from "./LogoTitle";
import NotificationDropdown from "./NotificationDropdown";

// 🔔 real notifications hook
import { useNotifications } from "../utils/useNotifications";

// Use the auth provider to get the token
import { useAuth } from "../state/AuthProvider";

export default function Navbar() {
  console.log("NAVBAR RENDERING");
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [showNavItems, setShowNavItems] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Get token from auth provider
  const { token } = useAuth();
  console.log("🔔 Token in Navbar:", token ? "Present" : "Missing");

  // Hook up real notifications
  const {
    notifications,
    unreadCount,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    refreshing,
    loadingMore,
  } = useNotifications(token);

  console.log("🔔 Navbar notifications state:", {
    count: notifications.length,
    unreadCount,
    token: token ? "Present" : "Missing",
  });

  // When opening the dropdown, refresh latest
  useEffect(() => {
    if (showNotifications) {
      console.log("🔔 Dropdown opened - calling refresh()");
      refresh?.();
    } else {
      console.log("🔔 Dropdown closed");
    }
  }, [showNotifications, refresh]);

  const handleToggleNavItems = () => {
    setShowNavItems(!showNavItems);
    setShowSearch(false);
    Animated.timing(slideAnimation, {
      toValue: showNavItems ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleOpenSearch = () => {
    setShowSearch(true);
    Animated.parallel([
      Animated.timing(slideAnimation, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(fadeAnimation, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleCloseSearch = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, { toValue: 0, duration: 300, useNativeDriver: false }),
      Animated.timing(fadeAnimation, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowSearch(false);
      setShowNavItems(false);
    });
  };

  const refreshApp = () => {
    navigation.dispatch(StackActions.replace("Home"));
  };

  // When an item is tapped inside the dropdown, do something & mark read
  const handleNotificationPress = async (n) => {
    try {
      await markAsRead?.(n.id);

      switch (n.type) {
        case "order_needs_shipping":
        case "delivery_details_submitted":
          navigation.navigate("SubmitTrackingNumber", {
            orderData: {
              orderId: n.orderId,
              artName: n.data?.artName,
              artistName: n.data?.artistName,
              price: n.data?.price,
              imageLink: n.data?.imageLink,
            },
          });
          break;
        case "order_paid":
        case "order_shipped":
        case "order_delivered":
          navigation.navigate("OrderDetails", { orderId: n.orderId });
          break;
        default:
          break;
      }
    } finally {
      setShowNotifications(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Pressable onPress={refreshApp} style={styles.logoAndTitle}>
          <Image source={logoImg} style={styles.logo} />
          <LogoTitle />
        </Pressable>

        {showNotifications && (
          <NotificationDropdown
            notifications={notifications}
            onPressItem={handleNotificationPress}
            onClose={() => setShowNotifications(false)}
            refreshing={refreshing}
            onRefresh={refresh}
            onLoadMore={loadMore}
            footerLoading={loadingMore}
            markAllRead={markAllAsRead}
          />
        )}

        <View style={styles.rightIcons}>
          {/* Notification Bell with unread badge */}
          <Pressable
            onPress={() => {
              console.log("🔔 NOTIFICATION BELL PRESSED!");
              console.log("🔔 Current showNotifications:", showNotifications);
              console.log("🔔 Current notifications count:", notifications.length);
              setShowNotifications((prev) => !prev);
            }}
            style={styles.iconButton}
          >
            <Icon name="notifications" size={26} color="black" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Menu Button */}
          <Pressable onPress={handleToggleNavItems} style={styles.iconButton}>
            <Icon name={showNavItems ? "close" : "menu"} size={30} color="black" />
          </Pressable>
        </View>
      </View>

      <Animated.View
        style={[
          styles.navItemsContainer,
          {
            transform: [
              {
                translateX: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/*
        <Pressable onPress={() => navigation.navigate("Statistics")} style={styles.navItem}>
          <Icon name="equalizer" size={24} color="black" />
        </Pressable>
        <Pressable onPress={handleOpenSearch} style={styles.navItem}>
          <Icon name="search" size={24} color="black" />
        </Pressable>
        */}
        <Pressable onPress={() => navigation.navigate("Settings")} style={styles.navItem}>
          <Icon name="settings" size={24} color="black" />
        </Pressable>
      </Animated.View>

      {showSearch && (
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnimation }]}>
          <LongSearchBar onClose={handleCloseSearch} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 99,
    width: "100%",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E02424",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  navItemsContainer: {
    position: "absolute",
    top: 12,
    right: 60,
    backgroundColor: "#dae2f0",
    paddingVertical: 11,
    paddingHorizontal: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navItem: {
    marginHorizontal: 8,
  },
  logoAndTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    // optional: styles for search container
  },
});
