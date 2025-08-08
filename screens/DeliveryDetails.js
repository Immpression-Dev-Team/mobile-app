import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../state/AuthProvider";
import { createOrder } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";

const DeliveryDetails = ({ navigation, route }) => {
  const { imageId, imageLink, artName, artistName, price } = route.params;
  const { token } = useAuth();

  const [name, setName] = useState("AWais");
  const [country, setCountry] = useState("United States");
  const [openCountry, setOpenCountry] = useState(false);
  const [address, setAddress] = useState("test");
  const [city, setCity] = useState("test");
  const [state, setState] = useState("Alaska");
  const [openState, setOpenState] = useState(false);
  const [zipCode, setZipCode] = useState("test");

  const countries = [
    { label: "United States", value: "United States" },
    {
      label: "(Only available in America for now)",
      value: "disabled",
      disabled: true,
    },
  ];

  const usStates = [
    { label: "Alabama", value: "Alabama" },
    { label: "Alaska", value: "Alaska" },
    { label: "Arizona", value: "Arizona" },
    { label: "Arkansas", value: "Arkansas" },
    { label: "California", value: "California" },
    { label: "Colorado", value: "Colorado" },
    { label: "Connecticut", value: "Connecticut" },
    { label: "Delaware", value: "Delaware" },
    { label: "Florida", value: "Florida" },
    { label: "Georgia", value: "Georgia" },
    { label: "Hawaii", value: "Hawaii" },
    { label: "Idaho", value: "Idaho" },
    { label: "Illinois", value: "Illinois" },
    { label: "Indiana", value: "Indiana" },
    { label: "Iowa", value: "Iowa" },
    { label: "Kansas", value: "Kansas" },
    { label: "Kentucky", value: "Kentucky" },
    { label: "Louisiana", value: "Louisiana" },
    { label: "Maine", value: "Maine" },
    { label: "Maryland", value: "Maryland" },
    { label: "Massachusetts", value: "Massachusetts" },
    { label: "Michigan", value: "Michigan" },
    { label: "Minnesota", value: "Minnesota" },
    { label: "Mississippi", value: "Mississippi" },
    { label: "Missouri", value: "Missouri" },
    { label: "Montana", value: "Montana" },
    { label: "Nebraska", value: "Nebraska" },
    { label: "Nevada", value: "Nevada" },
    { label: "New Hampshire", value: "New Hampshire" },
    { label: "New Jersey", value: "New Jersey" },
    { label: "New Mexico", value: "New Mexico" },
    { label: "New York", value: "New York" },
    { label: "North Carolina", value: "North Carolina" },
    { label: "North Dakota", value: "North Dakota" },
    { label: "Ohio", value: "Ohio" },
    { label: "Oklahoma", value: "Oklahoma" },
    { label: "Oregon", value: "Oregon" },
    { label: "Pennsylvania", value: "Pennsylvania" },
    { label: "Rhode Island", value: "Rhode Island" },
    { label: "South Carolina", value: "South Carolina" },
    { label: "South Dakota", value: "South Dakota" },
    { label: "Tennessee", value: "Tennessee" },
    { label: "Texas", value: "Texas" },
    { label: "Utah", value: "Utah" },
    { label: "Vermont", value: "Vermont" },
    { label: "Virginia", value: "Virginia" },
    { label: "Washington", value: "Washington" },
    { label: "West Virginia", value: "West Virginia" },
    { label: "Wisconsin", value: "Wisconsin" },
    { label: "Wyoming", value: "Wyoming" },
  ];

  const validateInputs = () => {
    if (!name || !address || !city || !state || !zipCode || !country) {
      Alert.alert("Error", "Please fill out all fields before continuing.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    const orderData = {
      imageId,
      artName,
      artistName,
      price,
      imageLink,
      deliveryDetails: {
        name,
        address,
        city,
        state,
        zipCode,
        country,
      },
    };

    try {
      const response = await createOrder(orderData, token);
      console.log("Order created:", response);
      navigation.replace("PaymentScreen", {
        orderId: response.orderId,
        price,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Order Failed", "Could not create order. Please try again.");
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Delivery Details</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.content}>
          <View style={styles.spacingBelowHeader} />
          <View style={styles.artCard}>
            {imageLink && (
              <Image
                source={{ uri: imageLink }}
                style={styles.artCardImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.artCardInfo}>
              <Text style={styles.artTitle}>{artName}</Text>
              {artistName && <Text style={styles.artArtist}>By: {artistName}</Text>}
              {price && <Text style={styles.artPrice}>${price.toFixed(2)}</Text>}
            </View>
          </View>



          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Street Address"
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
              <View style={{ zIndex: openState ? 3000 : 1 }}>
                <DropDownPicker
                  open={openState}
                  value={state}
                  items={usStates}
                  setOpen={setOpenState}
                  setValue={(callback) => setState(callback(state))}
                  placeholder="Select State"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  maxHeight={200}
                  searchable={true}
                  searchPlaceholder="Search your state."
                />
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              value={zipCode}
              onChangeText={setZipCode}
            />

            <View style={{ zIndex: openCountry ? 2000 : 0 }}>
              <DropDownPicker
                open={openCountry}
                value={
                  countries.some((c) => c.value === country) ? country : null
                }
                items={countries}
                setOpen={setOpenCountry}
                setValue={(callback) => setCountry(callback(country))}
                placeholder="Select Country"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            </View>

            <View style={styles.lineBreak} />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginBottom: -20,
  },
  goBackButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  arrow: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: "#1E2A3A",
  },

  content: { flexGrow: 1, alignItems: "flex-start", paddingHorizontal: 20 },
  spacingBelowHeader: {
    marginVertical: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textDetails: {
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
  artName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 16,
    color: "#555",
  },
  price: {
    fontSize: 16,
    color: "#007AFF",
  },
  formContainer: { width: "100%" },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 5,
    color: "#1E2A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: "#CCC",
    borderRadius: 5,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2A3A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // marginTop: 0,
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  
  lineBreak: {
    height: 20,
  },
  artCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  artCardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  artCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  artTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E2A3A",
    marginBottom: 4,
  },
  artArtist: {
    fontSize: 14,
    color: "#555",
  },
  artPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 4,
  },


});

export default DeliveryDetails;
