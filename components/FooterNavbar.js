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

const FooterNavbar = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/Bottom_Nav_Container_blue.png")} // Update path if needed
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/icons/Home_white.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => navigation.navigate("Upload")}
        >
          <Image
            source={require("../assets/icons/Sell_green.png")}
            style={styles.icon}
          />
          <Text style={styles.sellText}>SELL</Text>
          {/* Removed the circular style and adjusted to be like other buttons */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={require("../assets/icons/Profile_white.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>ME</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 90, // Adjust height as needed based on your image
    resizeMode: "cover", // Ensures the image covers the container
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%", // Ensures the container stretches to fill the background image
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  button: {
    alignItems: "center",
  },
  sellButton: {
    alignItems: "center",
    paddingBottom: 0,
  },
  text: {
    color: "#fff",
    fontSize: 10,
    marginTop: -10,
    // fontWeight: 'bold',
    textAlign: "center",
    fontFamily: "LEMON MILK Bold",
  },
  sellText: {
    color: "#fff",
    fontSize: 10,
    marginTop: 10,
    // fontWeight: 'bold',
    textAlign: "center",
    fontFamily: "LEMON MILK Bold",
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default FooterNavbar;
