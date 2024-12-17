import React, { useEffect, useRef, useState } from "react";
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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const apiKey = "AIzaSyDjV81pkoDixWpQlqDci4eobHzYaHMDFo4";

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
  const mapRef = useRef(null);

  const [validationError, setValidationError] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 40.734240, lng: -73.817039 });
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


const handleVerifyAddress = async () => {
  console.log("Verifying address...");

  if (!address || !city || !zipCode || (country === "United States" && !state)) {
    Alert.alert("Error", "Please fill out all required address fields.");
    return;
  }

  try {
    const validationResult = await validateAddress(address, city, state, zipCode, country);
    console.log("Validation Result:", validationResult);

    // Safely extract latitude and longitude
    if (validationResult?.geocode?.location) {
      const lat = validationResult.geocode.location.latitude;
      const lng = validationResult.geocode.location.longitude;

      // Update coordinates and focus map
      setCoordinates({ lat, lng });

      // Animate map on Android
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }

      console.log("Coordinates Updated:", { lat, lng });
    } else {
      console.warn("Location data missing.");
      Alert.alert("Warning", "Location data unavailable. Please refine your address.");
    }
  } catch (error) {
    console.error("Error validating address:", error.message || error.response?.data);
    Alert.alert("Error", "Address validation failed.");
  }
};

const validateInputs = () => {
  if (!address || !city || !state || !zipCode || !country) {
    Alert.alert("Error", "Please fill out all fields before continuing.");
    return false;
  }
  return true;
};

// Submit Handler
const handleSubmit = () => {
  if (!validateInputs()) return;

  // Pass information to the next page (e.g., Payment Page)
  navigation.navigate("PaymentScreen", {
    deliveryDetails: {
      address,
      city,
      state,
      zipCode,
      country,
      coordinates,
    },
  });
};

useEffect(() => {
  if (mapRef.current && coordinates.lat && coordinates.lng) {
    mapRef.current.animateToRegion(
      {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // Duration in milliseconds
    );
  }
}, [coordinates]);


useEffect(() => {
  console.log("Updated Suggested Address:", suggestedAddress);
  console.log("Updated Coordinates:", coordinates);
  console.log("Coordinates Updated:", coordinates);
}, [suggestedAddress, coordinates]);

useEffect(() => {
  if (mapRef.current && coordinates.lat && coordinates.lng) {
    mapRef.current.animateToRegion(
      {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // Duration in milliseconds
    );
  }
}, [coordinates]);


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
                <GooglePlacesAutocomplete
                  placeholder="Enter Address"
                  minLength={2} // Minimum characters to trigger suggestions
                  fetchDetails={true} // Fetch full details (structured components)
                  onPress={(data, details = null) => {
                    if (details) {
                      // Parse address components
                      const addressComponents = details.address_components;
                      const formattedAddress = details.formatted_address;

                      let country = "";
                      let city = "";
                      let state = "";
                      let zipCode = "";

                      // Extract fields from address components
                      addressComponents.forEach((component) => {
                        const types = component.types;

                        if (types.includes("country")) {
                          country = component.long_name; // Full country name
                        }
                        if (types.includes("locality")) {
                          city = component.long_name; // City
                        }
                        if (types.includes("administrative_area_level_1")) {
                          state = component.short_name; // State (short form like NY)
                        }
                        if (types.includes("postal_code")) {
                          zipCode = component.long_name; // Zip code
                        }
                      });

                      // Extract coordinates
                      const lat = details.geometry.location.lat;
                      const lng = details.geometry.location.lng;

                      // Update state for all fields
                      setAddress(formattedAddress);
                      setCity(city);
                      setState(state);
                      setZipCode(zipCode);
                      setCountry(country);
                      setCoordinates({ lat, lng });

                      // Log for debugging
                      console.log("Selected Address:", formattedAddress);
                      console.log("City:", city, "State:", state, "Zip Code:", zipCode, "Country:", country);
                      console.log("Coordinates Updated:", { lat, lng });
                    }
                  }}
                  query={{
                    key: apiKey, // Replace with your Google API Key
                    language: "en",
                    components: "country:us", // Restrict to US
                  }}
                  styles={{
                    textInputContainer: { width: "100%" },
                    textInput: styles.input,
                    listView: { backgroundColor: "#FFF", marginTop: 2 },
                  }}
                  enablePoweredByContainer={false}
                  debounce={200} // Delay to optimize API calls
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

                <View style={styles.lineBreak} />


                <MapView
                  ref={mapRef} // Attach ref for animateToRegion
                  style={styles.miniMap}
                  region={{
                    latitude: coordinates.lat || 40.734240, // Default fallback
                    longitude: coordinates.lng || -73.817039,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  {coordinates.lat && coordinates.lng && (
                    <Marker
                      coordinate={{
                        latitude: coordinates.lat,
                        longitude: coordinates.lng,
                      }}
                      title="Selected Location"
                    />
                  )}
                </MapView>




              <View style={styles.lineBreak} />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {console.log("Modal Visibility:", showSuggestions)}
        {console.log("Modal Coordinates:", coordinates)}
        {console.log("Suggested Address:", suggestedAddress)}

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
});

export default DeliveryDetails;
