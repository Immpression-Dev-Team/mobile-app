import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";
import { useNavigation } from '@react-navigation/native'; 

export default function Navbar() {
  const navigation = useNavigation();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    setNav(false);
  };

  const renderNavItems = () => {
    if (nav) {
      return (
        <View style={styles.navItems}>
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
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigateTo("Home")}>
        <Image source={logoImg} style={styles.logo} />
      </TouchableOpacity>
        <View style={styles.navItemsContainer}>
          {renderNavItems()}
        </View>
        <TouchableOpacity onPress={handleNav} style={styles.menuButton}>
          <Icon name={nav ? "close" : "menu"} size={30} color="black" />
        </TouchableOpacity>
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
    left: 50,
    right: 30,
    top: 10,
    bottom: 0,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  navItem: {
    marginHorizontal: 10,
  },
});
