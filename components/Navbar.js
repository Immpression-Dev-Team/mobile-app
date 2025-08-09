import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";
import { useNavigation, StackActions } from '@react-navigation/native';
import LongSearchBar from './LongSearchBar';
import LogoTitle from './LogoTitle';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [showNavItems, setShowNavItems] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', message: 'Your order has been shipped!' },
    { id: '2', message: 'New artwork has been uploaded in your favorite category.' },
    { id: '3', message: 'Your profile was viewed 5 times today.' },
  ];

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
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleCloseSearch = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowSearch(false);
      setShowNavItems(false);
    });
  };

  const refreshApp = () => {
    navigation.dispatch(StackActions.replace('Home'));
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
            onClose={() => setShowNotifications(false)}
          />
        )}


        <View style={styles.rightIcons}>
          {/* Notification Bell */}
          <Pressable
            onPress={() => setShowNotifications((prev) => !prev)}
            style={styles.iconButton}
          >
            <Icon name="notifications" size={26} color="black" />
          </Pressable>


          {/* Menu Button */}
          <Pressable onPress={handleToggleNavItems} style={styles.iconButton}>
            <Icon name={showNavItems ? "close" : "menu"} size={30} color="black" />
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.navItemsContainer, {
        transform: [{
          translateX: slideAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0],
          }),
        }],
      }]}>
        <Pressable onPress={() => navigation.navigate("Statistics")} style={styles.navItem}>
          <Icon name="equalizer" size={24} color="black" />
        </Pressable>
        <Pressable onPress={handleOpenSearch} style={styles.navItem}>
          <Icon name="search" size={24} color="black" />
        </Pressable>
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
    width: '100%',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  navItemsContainer: {
    position: 'absolute',
    top: 12,
    right: 60,
    backgroundColor: '#dae2f0',
    paddingVertical: 11,
    paddingHorizontal: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 8,
  },
  logoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
