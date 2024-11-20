import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
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
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Payment Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
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
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
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
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
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
