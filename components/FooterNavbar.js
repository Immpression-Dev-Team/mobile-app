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
      imgText: null,
    },
    {
      navLink: 'SellGuide', // was 'Upload'
      imgLink: sellIcon,
      imgText: 'SELL',
    },
    // {
    //   navLink: 'Upload',
    //   imgLink: sellIcon,
    //   imgText: 'SELL',
    // },
    {
      navLink: 'Profile',
      imgLink: profileIcon,
      imgText: null,
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
              {
                item.imgText && 
                <Text style={styles.text}>
                  {item.imgText}
                </Text>
              }
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
  },
  button: {
    alignItems: "center",
    width: 100,
    paddingVertical: 5,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "LEMON MILK Bold",
    marginTop: '7.5%',
  },
  icon: {
    width: "55%",
    height: "55%",
    resizeMode: "contain",
  },
  sellIcon: {
    width: "58%",
    height: "58%",
    resizeMode: "contain",
  },
});

export default FooterNavbar;