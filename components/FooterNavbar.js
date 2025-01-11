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
      imgText: 'HOME',
    },
    {
      navLink: 'Upload',
      imgLink: sellIcon,
      imgText: 'SELL',
    },
    {
      navLink: 'Profile',
      imgLink: profileIcon,
      imgText: 'ME',
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
                style={styles.icon}
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
    width: "100%",
    height: 90,
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
    fontSize: 10,
    textAlign: "center",
    fontFamily: "LEMON MILK Bold",
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
});

export default FooterNavbar;
