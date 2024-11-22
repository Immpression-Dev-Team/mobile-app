import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; // Import DropDownPicker
import { createOrder } from "../API/API";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { useAuth } from "../state/AuthProvider";

const DeliveryDetails = ({ navigation, route }) => {
  const { artName, imageLink, artistName, price } = route.params; // Extract all details from route.params
  const { userData, token } = useAuth(); // Retrieve userData and token
  const [name, setName] = useState("");
  const [country, setCountry] = useState(""); // State for the selected country
  const [open, setOpen] = useState(false); // State for dropdown visibility
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const countries = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
    { label: "India", value: "India" },
  ]; // List of countries

  const handleSubmit = async () => {
    if (!name || !country || !address || !city || !state || !zipCode) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const deliveryDetails = { name, country, address, city, state, zipCode };
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
        {/* Navbar Section */}
        <View style={styles.navbarContainer}>
            <ImageBackground
                source={require("../assets/backgrounds/navbar_bg_blue.png")}
                style={styles.navbarBackgroundImage}
            >
                <Navbar />
            </ImageBackground>
        </View>

        {/* Replace ScrollView with FlatList */}
        <FlatList
            data={[{ key: 'form' }]} // A single-item array to render the content
            renderItem={() => (
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        {imageLink && (
                            <Image
                                source={{ uri: imageLink }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}
                        <View style={styles.detailsContainer}>
                            <Text style={styles.artName}>{artName}</Text>
                            {artistName && (
                                <Text style={styles.artistName}>By: {artistName}</Text>
                            )}
                            {price && (
                                <Text style={styles.price}>Price: ${price}</Text>
                            )}
                        </View>
                    </View>
                    <Text style={styles.header}>Delivery Details</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <DropDownPicker
                            open={open}
                            value={country}
                            items={countries}
                            setOpen={setOpen}
                            setValue={setCountry}
                            placeholder="Select Country"
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
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
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />

        {/* Footer Section */}
        <View style={styles.footer}>
            <FooterNavbar />
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },
  navbarContainer: {
    width: "100%",
    height: "15%", // Adjust height for consistent navbar
    backgroundColor: "#FFF", // White background only for Navbar
  },
  navbarBackgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row", // Align image and text in a row
    alignItems: "center",
    width: "90%",
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "left", // Align text to the left
    width: "90%", // Ensure the width matches the form container
  },
  image: {
    width: 80, // Small size for the image
    height: 80,
    marginRight: 15, // Space between image and text
  },
  detailsContainer: {
    flexShrink: 1, // Allow text to wrap if necessary
  },
  artName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#007AFF",
  },
  formContainer: {
    width: "90%",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    width: "100%",
  },
  dropdownContainer: {
    borderColor: "#CCC",
    borderRadius: 5,
    zIndex: 1000, // Ensure dropdown is above other elements
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    width: "100%",
  },
});

export default DeliveryDetails;
