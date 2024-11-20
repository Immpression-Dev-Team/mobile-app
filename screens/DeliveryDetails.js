import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import Navbar from "../components/Navbar"; // Adjust the path if needed
import FooterNavbar from "../components/FooterNavbar"; // Adjust the path if needed

const DeliveryDetails = ({ navigation }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleContinue = () => {
    if (name && address && city && state && zipCode) {
      navigation.navigate("PaymentScreen", {
        deliveryDetails: { name, address, city, state, zipCode },
      });
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/backgrounds/navbar_bg_blue.png")}
        style={styles.navbarBackgroundImage}
      >
        <Navbar />
      </ImageBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Delivery Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={styles.input}
          placeholder="Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  navbarBackgroundImage: {
    width: "100%",
    height: 60,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeliveryDetails;
