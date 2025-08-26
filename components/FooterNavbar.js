import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const FooterNavbar = () => {
  const navigation = useNavigation();
  const navBtns = [
    {
      navLink: 'Home',
      iconName: 'home',
      label: 'Home',
    },
    {
      navLink: 'SellGuide',
      iconName: 'sell',
      label: 'Sell',
    },
    {
      navLink: 'Profile',
      iconName: 'person',
      label: 'Profile',
    },
  ]

  return (
    <View style={styles.container}>
      {navBtns.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate(item.navLink)}
        >
          <Icon 
            name={item.iconName} 
            size={24} 
            color="#635BFF" 
            style={styles.icon}
          />
          <Text style={styles.text}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  text: {
    color: "#635BFF",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default FooterNavbar;