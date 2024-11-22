import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { createOrder } from "../API/API";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { useAuth } from "../state/AuthProvider";

const DeliveryDetails = ({ navigation, route }) => {
  const { artName, imageLink, artistName, price } = route.params;
  const { userData, token } = useAuth();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [openCountry, setOpenCountry] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [openState, setOpenState] = useState(false);
  const [zipCode, setZipCode] = useState("");

  const countries = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
    { label: "India", value: "India" },
  ];

  const usStates = [
    { label: "Alabama", value: "Alabama" },
    { label: "Alaska", value: "Alaska" },
    { label: "Arizona", value: "Arizona" },
    { label: "Arkansas", value: "Arkansas" },
    { label: "California", value: "California" },
    { label: "Colorado", value: "Colorado" },
    // Add more states as needed
  ];

  const handleSubmit = async () => {
    if (
      !name ||
      !country ||
      !address ||
      !city ||
      (country === "United States" && !state) ||
      !zipCode
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const deliveryDetails = { name, country, address, city, state, zipCode };
      const orderData = {
        artName,
        userAccountName: userData.user.user.name,
        deliveryDetails,
      };

      const response = await createOrder(orderData, token);

      Alert.alert("Success", "Order placed successfully!");
      navigation.goBack();
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

      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <FlatList
          data={[{ key: "form" }]}
          scrollEnabled={true} // Always allow scrolling
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
                  {artistName && <Text style={styles.artistName}>By: {artistName}</Text>}
                  {price && <Text style={styles.price}>Price: ${price}</Text>}
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
                <View style={{ zIndex: openCountry ? 1000 : 1 }}>
                  <DropDownPicker
                    open={openCountry}
                    value={country}
                    items={countries}
                    setOpen={setOpenCountry}
                    setValue={setCountry}
                    placeholder="Select Country"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                  />
                </View>
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
                {country === "United States" && (
                  <View style={{ zIndex: openState ? 1000 : 1 }}>
                    <DropDownPicker
                      open={openState}
                      value={state}
                      items={usStates}
                      setOpen={setOpenState}
                      setValue={setState}
                      placeholder="Select State"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Zip Code"
                  value={zipCode}
                  onChangeText={setZipCode}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </KeyboardAvoidingView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <FooterNavbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  navbarContainer: { width: "100%", height: "15%", backgroundColor: "#FFF" },
  navbarBackgroundImage: { width: "100%", height: "100%", resizeMode: "cover" },
  content: { flexGrow: 1, alignItems: "center" },
  headerContainer: { flexDirection: "row", alignItems: "center", width: "90%", marginVertical: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginVertical: 10, width: "90%" },
  image: { width: 80, height: 80, marginRight: 15 },
  detailsContainer: { flexShrink: 1 },
  artName: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  artistName: { fontSize: 16, color: "#555", marginBottom: 5 },
  price: { fontSize: 16, color: "#007AFF" },
  formContainer: { width: "90%", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 10, marginBottom: 15, fontSize: 16 },
  dropdown: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, marginBottom: 15, padding: 10 },
  dropdownContainer: { borderColor: "#CCC", borderRadius: 5, zIndex: 1000 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  footer: { width: "100%" },
});

export default DeliveryDetails;
