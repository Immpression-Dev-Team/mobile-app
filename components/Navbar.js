import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';

export default function Navbar() {
  const navigation = useNavigation();
  const [nav, setNav] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current; // Start with 0 (off screen)
  const [displayNav, setDisplayNav] = useState('none');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleNav = () => {
    const newValue = !nav;
    const toValue = newValue ? 1 : 0; // Slide in (1) or slide out (0)

    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setNav(newValue);
      setDisplayNav(newValue ? 'flex' : 'none');
    });
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    setNav(false);
  };

  const handleSearch = () => {
    setShowSearchBar(true);
  };

  const closeSearchBar = () => {
    setShowSearchBar(false);
  };

  const renderNavItems = () => {
    return (
      <Animated.View style={[styles.navItemsContainer, {
        transform: [
          {
            translateX: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [200, 0], // Slide from right (200) to left (0)
            }),
          },
        ],
        display: displayNav, // Dynamically set display property
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
        <TouchableOpacity onPress={handleSearch} style={styles.navItem}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigateTo("Home")}>
          <Image source={logoImg} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNav} style={styles.menuButton}>
          <Icon name={nav ? "close" : "menu"} size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        {renderNavItems()}
        <Modal
          visible={showSearchBar}
          animationType="slide"
          transparent={true}
          onRequestClose={closeSearchBar}
        >
          <TouchableWithoutFeedback onPress={closeSearchBar}>
            <View style={styles.overlay}>
              <View style={styles.searchContainer}>
                <SearchBar />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    right: 70, // Start off screen (right)
    backgroundColor: 'white',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 10,
    display: 'none', // Initially hidden
  },
  navItem: {
    marginHorizontal: 10,
  },
  centerContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
});
