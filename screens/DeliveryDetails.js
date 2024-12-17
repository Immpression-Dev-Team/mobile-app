import React, { useEffect, useState } from "react";
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
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { createOrder } from "../API/API";
import MapView, { Marker } from 'react-native-maps';
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { useAuth } from "../state/AuthProvider";
import axios from "axios";

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

  const [validationError, setValidationError] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0});
  const [selectedAddress, setSelectedAddress] = useState(null);

  const countries = [
    { label: "United States", value: "United States" },
    { label: "Canada", value: "Canada" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
    { label: "India", value: "India" },
  ];

  const countryCodeMapping = {
    "United States": "US",
    "Canada": "CA",
    "United Kingdom": "GB",
    "Australia": "AU",
    "India": "IN",
  };
  

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
    { label: "Washington", value: "Washingtion" },
    { label: "West Virginia", value: "West Virginia" },
    { label: "Wisconsin", value: "Wisconsin" },
    { label: "Wyoming", value: "Wyoming" },
  ];

  const validateAddress = async (address, city, state, zipCode, country) => {
    const apiKey = "AIzaSyDjV81pkoDixWpQlqDci4eobHzYaHMDFo4";
    
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;
    const regionCode = countryCodeMapping[country];

    if (!regionCode) {
      console.error(`Unsupported country: ${country}`);
      Alert.alert("Error", "Unsupported country selected.");
      return null;
    }

  const requestData = {
    address: {
      regionCode: regionCode,
      locality: city,
      administrativeArea: state,
      postalCode: zipCode,
      addressLines: [address],
    },
  };

  try {
    const response = await axios.post(url, requestData);
    console.log("Full API Response:", response.data);
    if (response.data.result) {
      return response.data.result;
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Error validating address:", error.response?.data || error.message);
    Alert.alert("Error", "Failed to validate address. Please try again.");
    return null;
  }
};

// const handleVerifyAddress = async () => {
//   console.log("Verifying address...");

//   if (!address || !city || !zipCode || (country === "United States" && !state)) {
//     Alert.alert("Error", "Please fill out all required address fields.");
//     return;
//   }

//   try {
//     const validationResult = await validateAddress(address, city, state, zipCode, country);
//     console.log("Validation Result:", validationResult);

//     if (validationResult && validationResult.address) {

//       const location = validationResult.address.location;
//       const suggested = validationResult.address.formattedAddress || "Suggested Address Unavailable";
//       const lat = location.latitude || 40.734240;
//       const lng = location.longitude || -73.817039;

//       setSuggestedAddress(suggested);
//       setCoordinates({ lat, lng });

//       console.log("Suggested Address:", suggested);
//       console.log("Coordinates Updated:", { lat, lng });
//       Alert.alert("Success", "Suggested address retrieved. Please select an option.");
//     } else {
//       Alert.alert("Error", "No suggested address found. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error validating address:", error.response?.data || error.message);
//     Alert.alert("Error", "Address validation failed. Please try again.");
//   }
// };

// const handleVerifyAddress = async () => {
//   console.log("Verifying address...");

//   if (!address || !city || !zipCode || (country === "United States" && !state)) {
//     Alert.alert("Error", "Please fill out all required address fields.");
//     return;
//   }

//   try {
//     const validationResult = await validateAddress(address, city, state, zipCode, country);
//     console.log("Validation Result:", validationResult);

//     if (validationResult && validationResult.address) {
//       const location = validationResult.address.location;

//       if (location && location.latitude && location.longitude) {
//         // Location exists - update coordinates
//         const suggested = validationResult.address.formattedAddress || "Suggested Address Unavailable";
//         const lat = location.latitude;
//         const lng = location.longitude;

//         setSuggestedAddress(suggested);
//         setCoordinates({ lat, lng });

//         console.log("Suggested Address:", suggested);
//         console.log("Coordinates Updated:", { lat, lng });
//         Alert.alert("Success", "Suggested address retrieved. Please select an option.");
//       } else {
//         // Location is missing
//         console.warn("Location data is missing from the API response.");
//         Alert.alert("Warning", "Location data is unavailable. Please refine your address.");
//         setSuggestedAddress(null);
//         setCoordinates({ lat: 40.734240, lng: -73.817039 }); // Default fallback
//       }
//     } else {
//       Alert.alert("Error", "No suggested address found. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error validating address:", error.response?.data || error.message);
//     Alert.alert("Error", "Address validation failed. Please check your input and try again.");
//   }
// };

const handleVerifyAddress = async () => {
  console.log("Verifying address...");

  if (!address || !city || !zipCode || (country === "United States" && !state)) {
    Alert.alert("Error", "Please fill out all required address fields.");
    return;
  }

  try {
    const validationResult = await validateAddress(address, city, state, zipCode, country);
    console.log("Validation Result:", validationResult);

    // Access the location under geocode
    if (validationResult && validationResult.geocode && validationResult.geocode.location) {
      const suggested = validationResult.address.formattedAddress || "Suggested Address Unavailable";
      const lat = validationResult.geocode.location.latitude;
      const lng = validationResult.geocode.location.longitude;

      setSuggestedAddress(suggested);
      setCoordinates({ lat, lng });

      console.log("Suggested Address:", suggested);
      console.log("Coordinates Updated:", { lat, lng });
      Alert.alert("Success", "Suggested address retrieved. Please select an option.");
    } else {
      console.warn("Location data is missing from the API response.");
      Alert.alert("Warning", "Location data is unavailable. Please refine your address.");
      setSuggestedAddress(null);
      setCoordinates({ lat: 40.734240, lng: -73.817039 }); // Default fallback
    }
  } catch (error) {
    console.error("Error validating address:", error.response?.data || error.message);
    Alert.alert("Error", "Address validation failed. Please check your input and try again.");
  }
};






const handleSubmit = async () => {
  console.log("Continue button pressed");

  if (!name || !country || !address || !city || (country === "United States" && !state) || !zipCode) {
    console.log("Validation failed:", { name, country, address, city, state, zipCode });
    Alert.alert("Error", "Please fill out all fields.");
    return;
  }

  const deliveryDetails = { name, country, address, city, state, zipCode };
  const finalAddress = selectedAddress === "suggested" ? suggestedAddress : address;
  try {
    const orderData = {
      artName: route.params.artName,
      userAccountName: userData.user.user.name,
      deliveryDetails,
    };
    console.log("Creating order:", orderData);
    await createOrder(orderData, token);
    console.log("Order created successfully, navigating to PaymentScreen");
    navigation.navigate("PaymentScreen", {
      artName: route.params.artName,
      price: route.params.price,
      deliveryDetails: {
        address: finalAddress,
        city,
        state,
        zipCode,
        country,
      },
    });
  } catch (error) {
    console.error("Error placing order:", error);
    Alert.alert("Error", "Failed to proceed to payment.");
  }
};

useEffect(() => {
  console.log("Updated Suggested Address:", suggestedAddress);
  console.log("Updated Coordinates:", coordinates);
  console.log("Coordinates Updated:", coordinates);
}, [suggestedAddress, coordinates]);

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const debouncedValidateAddress = debounce(validateAddress, 500);

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

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Delivery Details</Text>
      </View>

      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <FlatList
          data={[{ key: "form" }]}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={() => (
            <View style={styles.content}>
              <View style={styles.spacingBelowHeader} />
              <View style={styles.detailsContainer}>
                {imageLink && (
                  <Image
                    source={{ uri: imageLink }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.textDetails}>
                  <Text style={styles.artName}>{artName}</Text>
                  {artistName && <Text style={styles.artistName}>By: {artistName}</Text>}
                  {price && <Text style={styles.price}>Price: ${price}</Text>}
                </View>
              </View>
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
                  onChangeText={(text) => {setAddress(text);
                    debouncedValidateAddress(text, city, state, zipCode, country);
                  }}
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

                <View style={styles.lineBreak} />
                
                  {/* <MapView
                    key={`${coordinates.lat}-${coordinates.lng}`}
                    style={styles.miniMap}
                    region={{
                      latitude: coordinates.lat || 40.734240, // Default to Queens College if no coordinates
                      longitude: coordinates.lng || -73.817039,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    {console.log("Mini Map Coordinates:", coordinates)}
                      <Marker
                        coordinate={{
                          latitude: coordinates.lat || 40.734240,
                          longitude: coordinates.lng || -73.817039,
                        }}
                        title="Suggested Location"
                        description={suggestedAddress || "No address selected"}
                      />
                  </MapView> */}

                  <MapView
                    key={`${coordinates.lat}-${coordinates.lng}`} // Forces re-render when coordinates change
                    style={styles.miniMap}
                    region={{
                      latitude: coordinates.lat || 40.734240, // Default to Queens College if no coordinates
                      longitude: coordinates.lng || -73.817039,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: coordinates.lat || 40.734240,
                        longitude: coordinates.lng || -73.817039,
                      }}
                      title="Suggested Location"
                      description={suggestedAddress || "No address selected"}
                    />
                  </MapView>


              <View style={styles.lineBreak} />

              <View style={styles.radioContainer}>
                  <Text style={styles.radioTitle}>Choose Address</Text>

                  {/* {Suggested Address} */}
                  <TouchableOpacity
                    style={[styles.radioOption,
                      selectedAddress === "suggested" && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedAddress("suggested")}
                  >
                    <Text style={styles.radioText}>
                      {suggestedAddress
                        ? `• Suggested Address: ${suggestedAddress}`
                        : "• Suggested Address: Not Available"
                      }
                    </Text>
                  </TouchableOpacity>

                  {/* User entered Address */}
                  <TouchableOpacity
                    style={[
                      styles.radioOption,
                      selectedAddress === "manual" && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedAddress("manual")}
                  >
                    <Text style={styles.radioText}>
                      {`• Entered Address: ${address}`}
                    </Text>
                  </TouchableOpacity>
              </View>
              {/* Address validation error and suggestions */}
              {validationError && <Text style={styles.errorText}>{validationError}</Text>}
                  {addressSuggestions.length > 0 && (
                    <View>
                      <Text style={styles.suggestionText}>Did you mean:</Text>
                      {addressSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setAddress(suggestion); // Update address field with suggestion
                            setValidationError(null);
                            setAddressSuggestions([]); // Clear suggestions
                          }}
                        >
                          <Text style={styles.suggestion}>{suggestion}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyAddress}>
              <Text style={styles.buttonText}>Verify Address</Text>
            </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {backgroundColor: selectedAddress ? "#007AFF" : "#CCCCCC"},]} onPress={handleSubmit} disabled={!selectedAddress}>
                  <Text style={styles.buttonText}>
                    {
                      selectedAddress === "suggested"
                      ? "Continue with Suggested"
                      : "Continue with Manual"
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {console.log("Modal Visibility:", showSuggestions)}
        {console.log("Modal Coordinates:", coordinates)}
        {console.log("Suggested Address:", suggestedAddress)}

        <Modal visible={showSuggestions} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Address Suggestion</Text>
              <MapView
                style={styles.map}
                region={{
                  latitude: coordinates.lat || 40.734240,
                  longitude: coordinates.lng || -73.817039,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: coordinates.lat || 40.734240,
                    longitude: coordinates.lng || -73.817039,
                  }}
                  title="Suggested Address"
                  description={suggestedAddress}
                />
              </MapView>
              <Text style={styles.suggestionText}>{suggestedAddress}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setAddress(suggestedAddress);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.buttonText}>Use Suggested</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowSuggestions(false)}
                >
                  <Text style={styles.buttonText}>Keep Current</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>

      {/* Footer Section */}
      <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  navbarContainer: { width: "100%", height: "15%", backgroundColor: "#FFF" },
  navbarBackgroundImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  goBackButton: {
    marginRight: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: { flexGrow: 1, alignItems: "flex-start", paddingHorizontal: 20 },
  spacingBelowHeader: {
    marginVertical: 20, // Add spacing between the header and the art
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
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 10, marginBottom: 15 },
  dropdown: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, marginBottom: 15 },
  dropdownContainer: { borderColor: "#CCC", borderRadius: 5, },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  suggestion:{
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  map:{
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  miniMap: {
    width: "100%",
    height: 200,
    borderRadius: 30,
    marginVertical: 10,
  },
  verifyButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  lineBreak: {
    color: "#f0f0f0",
    height: 20,
  },
  radioContainer:{
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioText: {
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  button:{
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  radioOption:{
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10, 
    marginVertical: 5,
  },
  selectedOption: {
    borderColor: "#007AFF",
  },
});

export default DeliveryDetails;
