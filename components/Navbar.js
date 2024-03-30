import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";
import { useNavigation } from '@react-navigation/native'; 
import HomeScreen from '../screens/Home';
import StatisticsScreen from '../screens/Statistics';
import GalleryScreen from '../screens/Gallery';
import SettingsScreen from '../screens/Settings';

export default function Navbar() {
  const navigation = useNavigation();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navigateTo = (screens) => {
    navigation.navigate(screens); // Function to navigate to a screen
    setNav(false); // Close the navigation menu after navigating
  };

  const renderNavItems = () => {
    if (nav) {
      return (
        <View style={styles.navItems}>
          <TouchableOpacity onPress={() => navigateTo("Home")}>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Statistics")}>
            <Text style={styles.navItem}>Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Gallery")}>
            <Text style={styles.navItem}>My Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("Settings")}>
            <Text style={styles.navItem}>Settings</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={logoImg} style={styles.logo} />
        <TouchableOpacity onPress={handleNav} style={styles.menuButton}>
          <Icon name={nav ? "close" : "menu"} size={30} color="black" />
        </TouchableOpacity>
      </View>
      {renderNavItems()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  menuButton: {
    padding: 0,
  },
  navItems: {
    position: 'absolute',
    top: 100, // Adjust as needed
    left: 20, // Adjust as needed
  },
  navItem: {
    fontSize: 18,
    marginBottom: 10,
  },
});
