import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";

const PaymentScreen = ({ navigation, route }) => {
  const { orderId } = route.params; // Order ID passed from the DeliveryDetails screen
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      Alert.alert("Missing Fields", "Please fill in all payment fields.");
      return;
    }

    try {
      // Simulate a payment process
      Alert.alert("Payment Successful", "Your payment has been processed!");

      // Navigate to the Review/Summary Screen
      navigation.navigate("ReviewScreen", { orderId });
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Payment Failed", "An error occurred while processing payment.");
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

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Payment Details</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Number Input with Icon */}
        <View style={styles.inputContainer}>
          <Image
            source={require("../assets/icons/credit-card-icon.png")}
            style={styles.icon}
          />
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Other Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Expiry Date (MM/YY)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Name on Card"
          value={nameOnCard}
          onChangeText={setNameOnCard}
        />

        {/* Pay Now Button */}
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Section */}
      <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  navbarContainer: {
    width: "100%",
    height: "15%",
    backgroundColor: "#FFF",
  },
  navbarBackgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  goBackButton: {
    marginRight: 15,
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
  content: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PaymentScreen;
