import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { createOrder } from "../API/API";
import Navbar from "../components/Navbar"; // Adjust the path if needed
import FooterNavbar from "../components/FooterNavbar"; // Adjust the path if needed
import { useAuth } from "../state/AuthProvider"; // Import useAuth to access the token

const DeliveryDetails = ({ navigation, route }) => {
  const { artName } = route.params; // Get the art name from navigation params
  const { userData, token } = useAuth(); // Retrieve userData and token
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = async () => {
    if (!name || !address || !city || !state || !zipCode) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const deliveryDetails = { name, address, city, state, zipCode };
      const orderData = {
        artName,
        userAccountName: userData.user.user.name, // Include account name
        deliveryDetails,
      };

      const response = await createOrder(orderData, token);

      Alert.alert("Success", "Order placed successfully!");
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place the order.");
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
        <Text style={styles.subHeader}>For: {artName}</Text>
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
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  navbarBackgroundImage: {
    width: "100%",
    height: 60,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subHeader: { fontSize: 18, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});

export default DeliveryDetails;
