import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../state/AuthProvider";
import { createOrder } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";

const DeliveryDetails = ({ navigation, route }) => {
  const { imageId, imageLink, artName, artistName, price } = route.params;
  const { token } = useAuth();

  // form state
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United States");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setStateVal] = useState("");
  const [zipCode, setZipCode] = useState("");

  // dropdown state
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);

  // focus refs
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const address2Ref = useRef(null);
  const cityRef = useRef(null);
  const zipRef = useRef(null);

  const countries = [
    { label: "United States", value: "United States" },
    { label: "(Only available in America for now)", value: "disabled", disabled: true },
  ];

  const usStates = [
    { label: "Alabama", value: "Alabama" }, { label: "Alaska", value: "Alaska" },
    { label: "Arizona", value: "Arizona" }, { label: "Arkansas", value: "Arkansas" },
    { label: "California", value: "California" }, { label: "Colorado", value: "Colorado" },
    { label: "Connecticut", value: "Connecticut" }, { label: "Delaware", value: "Delaware" },
    { label: "Florida", value: "Florida" }, { label: "Georgia", value: "Georgia" },
    { label: "Hawaii", value: "Hawaii" }, { label: "Idaho", value: "Idaho" },
    { label: "Illinois", value: "Illinois" }, { label: "Indiana", value: "Indiana" },
    { label: "Iowa", value: "Iowa" }, { label: "Kansas", value: "Kansas" },
    { label: "Kentucky", value: "Kentucky" }, { label: "Louisiana", value: "Louisiana" },
    { label: "Maine", value: "Maine" }, { label: "Maryland", value: "Maryland" },
    { label: "Massachusetts", value: "Massachusetts" }, { label: "Michigan", value: "Michigan" },
    { label: "Minnesota", value: "Minnesota" }, { label: "Mississippi", value: "Mississippi" },
    { label: "Missouri", value: "Missouri" }, { label: "Montana", value: "Montana" },
    { label: "Nebraska", value: "Nebraska" }, { label: "Nevada", value: "Nevada" },
    { label: "New Hampshire", value: "New Hampshire" }, { label: "New Jersey", value: "New Jersey" },
    { label: "New Mexico", value: "New Mexico" }, { label: "New York", value: "New York" },
    { label: "North Carolina", value: "North Carolina" }, { label: "North Dakota", value: "North Dakota" },
    { label: "Ohio", value: "Ohio" }, { label: "Oklahoma", value: "Oklahoma" },
    { label: "Oregon", value: "Oregon" }, { label: "Pennsylvania", value: "Pennsylvania" },
    { label: "Rhode Island", value: "Rhode Island" }, { label: "South Carolina", value: "South Carolina" },
    { label: "South Dakota", value: "South Dakota" }, { label: "Tennessee", value: "Tennessee" },
    { label: "Texas", value: "Texas" }, { label: "Utah", value: "Utah" },
    { label: "Vermont", value: "Vermont" }, { label: "Virginia", value: "Virginia" },
    { label: "Washington", value: "Washington" }, { label: "West Virginia", value: "West Virginia" },
    { label: "Wisconsin", value: "Wisconsin" }, { label: "Wyoming", value: "Wyoming" },
  ];

  const validateInputs = () => {
    if (!name || !address || !city || !state || !zipCode || !country) {
      Alert.alert("Error", "Please fill out all fields before continuing.");
      return false;
    }
    if (country !== "United States") {
      Alert.alert("Sorry!", "We currently ship only within the United States.");
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
        address: address2 ? `${address}, ${address2}` : address,
        city,
        state,
        zipCode,
        country,
      },
    };

    try {
      const response = await createOrder(orderData, token);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // adjust if your header height differs
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {/* Top bar */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Text style={styles.arrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Delivery Details</Text>
          </View>

          {/* Art summary card */}
          <View style={styles.artCard}>
            {!!imageLink && (
              <Image source={{ uri: imageLink }} style={styles.artCardImage} resizeMode="cover" />
            )}
            <View style={styles.artCardInfo}>
              <Text style={styles.artTitle}>{artName}</Text>
              {!!artistName && <Text style={styles.artArtist}>By {artistName}</Text>}
              {typeof price === "number" && <Text style={styles.artPrice}>${price.toFixed(2)}</Text>}
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              ref={nameRef}
              style={styles.input}
              placeholder="Jane Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
            />

            <Text style={styles.label}>Country</Text>
            <DropDownPicker
              open={openCountry}
              value={countries.some((c) => c.value === country) ? country : null}
              items={countries}
              setOpen={(v) => {
                // closing state picker if country opens to avoid overlap
                if (v) setOpenState(false);
                setOpenCountry(v);
              }}
              setValue={(fn) => setCountry(fn(country))}
              placeholder="Select Country"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="MODAL"
              modalTitle="Select Country"
              modalProps={{ animationType: "slide" }}
              modalContentContainerStyle={{ paddingHorizontal: 16 }}
            />

            <Text style={styles.label}>Street Address</Text>
            <TextInput
              ref={addressRef}
              style={styles.input}
              placeholder="123 Main St"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              autoComplete="street-address"
              returnKeyType="next"
              onSubmitEditing={() => address2Ref.current?.focus()}
            />

            <Text style={styles.label}>Apt, Suite, etc. (optional)</Text>
            <TextInput
              ref={address2Ref}
              style={styles.input}
              placeholder="Apt 4B"
              value={address2}
              onChangeText={setAddress2}
              autoCapitalize="characters"
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              ref={cityRef}
              style={styles.input}
              placeholder="Los Angeles"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              autoComplete="postal-address-locality"
              returnKeyType="next"
              onSubmitEditing={() => {
                if (country === "United States") {
                  setOpenState(true);
                } else {
                  zipRef.current?.focus();
                }
              }}
            />

            {country === "United States" && (
              <>
                <Text style={styles.label}>State</Text>
                <DropDownPicker
                  open={openState}
                  value={state}
                  items={usStates}
                  setOpen={(v) => {
                    if (v) setOpenCountry(false);
                    setOpenState(v);
                  }}
                  setValue={(fn) => setStateVal(fn(state))}
                  placeholder="Select State"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  listMode="MODAL"
                  searchable
                  searchPlaceholder="Search state"
                  modalTitle="Select State"
                  modalProps={{ animationType: "slide" }}
                  modalContentContainerStyle={{ paddingHorizontal: 16 }}
                  onClose={() => zipRef.current?.focus()}
                />
              </>
            )}

            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              ref={zipRef}
              style={styles.input}
              placeholder="90001"
              value={zipCode}
              onChangeText={setZipCode}
              autoComplete="postal-code"
              keyboardType="number-pad"
              returnKeyType="done"
            />

            <View style={{ height: 12 }} />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.9}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Extra space so the last input + button aren't hidden by the keyboard */}
            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },

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
    marginBottom: -10,
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

  artCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },
  artCardImage: { width: 80, height: 80, borderRadius: 8 },
  artCardInfo: { marginLeft: 12, flex: 1 },
  artTitle: { fontSize: 18, fontWeight: "700", color: "#1E2A3A", marginBottom: 2 },
  artArtist: { fontSize: 14, color: "#555" },
  artPrice: { fontSize: 15, fontWeight: "bold", color: "#007AFF", marginTop: 4 },

  formContainer: { width: "100%", paddingHorizontal: 20 },

  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E2A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1.5,
    elevation: 1,
    marginBottom: 4,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    minHeight: 48,
    marginBottom: 6,
  },
  dropdownContainer: {
    borderColor: "#D1D5DB",
    borderRadius: 10,
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
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
});

export default DeliveryDetails;
