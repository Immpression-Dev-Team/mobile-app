import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';

export default function Navbar() {
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [showNavItems, setShowNavItems] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const handleToggleNavItems = () => {
    setShowNavItems(!showNavItems); // Toggle navigation items container
    setShowSearch(false); // Hide search bar
    Animated.timing(slideAnimation, {
      toValue: showNavItems ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleOpenSearch = () => {
    // setShowNavItems(!showNavItems);
    
    setShowSearch(true); // Open search bar
        Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCloseSearch = () => {
    setShowSearch(false); // Close search bar
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const navigateTo = (screenName) => {
    handleCloseSearch(); // Close search bar if open
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigateTo("Home")}>
          <Image source={logoImg} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleNavItems} style={styles.menuButton}>
          <Icon name={showNavItems ? "close" : "menu"} size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.navItemsContainer, {
        transform: [
          {
            translateX: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [400, 0], // Slide in from right (300) to show
            }),
          },
        ],
      }]}>
        <TouchableOpacity onPress={() => navigateTo("Home")} style={styles.navItem}>
          <Icon name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Statistics")} style={styles.navItem}>
          <Icon name="equalizer" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Gallery")} style={styles.navItem}>
          <Icon name="photo-library" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("Settings")} style={styles.navItem}>
          <Icon name="settings" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenSearch} style={styles.navItem}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
      {showSearch && (
        <Animated.View style={[styles.searchContainer, {
          transform: [
            {
              translateX: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0], // Slide in from right (300) to show
              }),
            },
          ],
        }]}>
          <SearchBar onClose={handleCloseSearch} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 99,
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
  menuButton: {
    padding: 10,
  },
  navItemsContainer: {
    position: 'absolute',
    top: 12,
    right: 70,
    backgroundColor: 'white',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 10,
  },
  searchContainer: {
    position: 'absolute',
    marginTop: -7,
    marginLeft: 80,
    marginRight: 0,
    zIndex: 100,
  },
});