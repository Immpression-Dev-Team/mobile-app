import React, {useState} from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImg from "../assets/Logo_T.png";

export default function Navbar() {
  const [nav,setNav] = useState(false)

  const handleNav = () => {
    setNav(!nav)
  }

  return (
    <View style={styles.navbar}>
      <Image source={logoImg} style={styles.logo} />
      <TouchableOpacity onPress={handleNav} style={styles.menuButton}>
        <Icon name={nav ? "close" : "menu"} size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

