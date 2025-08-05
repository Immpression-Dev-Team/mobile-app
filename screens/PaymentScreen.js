import { CardField, useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createPaymentIntent } from "../API/API";
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from "./Template/ScreenTemplate";
import axios from "axios";
import { API_URL } from "../API_URL";

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, price } = route.params;
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();
  const { userData, setUserData, logout } = useAuth();
  const token = userData?.token;

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await createPaymentIntent(
        { orderId, price: Math.round(price * 100) },
        token
      );
      if (!response.clientSecret) {
        throw new Error("No client secret received from server");
      }
      console.log("response", response);

      const { error, paymentIntent } = await confirmPayment(
        response.clientSecret,
        {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: userData.name,
            },
          },
        }
      );
      console.log("paymentIntent", paymentIntent);
      console.log("error", error);

      if (error) {
        updateOrder("failed");
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        updateOrder("paid");
      }
    } catch (error) {
      updateOrder("failed");
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          error.message ||
          "An error occurred while processing payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (status) => {
    try {
      await axios.put(
        `${API_URL}/order/${orderId}`,
        { status, transactionId: "123xyz" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === "paid") {
        navigation.replace("ReviewScreen", { orderId });
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <ScreenTemplate>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.orderDetails}>
          <Text style={styles.header}>Payment Details</Text>
          <Text style={styles.price}>Price: ${price}</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={styles.cardField}
        />

        {/* Pay Now Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
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
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
  cardField: {
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  orderDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 20,
  },
});

export default PaymentScreen;
