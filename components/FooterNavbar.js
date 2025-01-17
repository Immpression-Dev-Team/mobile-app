import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import homeIcon from '../assets/icons/Home_white.png';
import sellIcon from '../assets/icons/Sell_green.png';
import profileIcon from '../assets/icons/Profile_white.png';

const FooterNavbar = () => {
  const navigation = useNavigation();
  const navBtns = [
    {
      navLink: 'Home',
      imgLink: homeIcon,
      imgText: '',
    },
    {
      navLink: 'Upload',
      imgLink: sellIcon,
      imgText: 'SELL',
    },
    {
      navLink: 'Profile',
      imgLink: profileIcon,
      imgText: '',
    },
  ]

  return (
    <ImageBackground
      source={require("../assets/Bottom_Nav_Container_blue.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {
          navBtns.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(item.navLink)}
            >
              <Image
                source={item.imgLink}
                style={(item.imgText === 'SELL') ? styles.sellIcon : styles.icon }
              />
              <Text style={[styles.text, { marginTop: (item.imgText === 'SELL') ?  `10` : `-10` }]}>
                {item.imgText}
              </Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  button: {
    alignItems: "center",
    width: 100,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "LEMON MILK Bold",
  },
  icon: {
    width: 47.5,
    height: 47.5,
    resizeMode: "contain",
  },
  sellIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default FooterNavbar;