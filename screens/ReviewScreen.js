import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../state/AuthProvider";
import axios from "axios";
import { API_URL } from "../API_URL";

const ReviewScreen = ({ route }) => {
  const { orderId } = route.params;
  const { userData } = useAuth();
  const token = userData?.token;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/orderDetails/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setOrder(response.data); // support both {order: ...} and direct order
        console.log("Order details:", response.data);
        setOrder(response.data.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>No order details found.</Text>
      </View>
    );
  }

  const delivery = order.deliveryDetails || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Order Review</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Delivery Details</Text>
        <Text>Address: {order?.deliveryDetails?.address}</Text>
        <Text>City: {order?.deliveryDetails?.city}</Text>
        <Text>State: {order?.deliveryDetails?.state}</Text>
        <Text>Zip Code: {order?.deliveryDetails?.zipCode}</Text>
        <Text>Country: {order?.deliveryDetails?.country}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Order Details</Text>
        <Text>Order ID: {order._id}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Art Name: {order.artName}</Text>
        <Text>Artist: {order.artistName}</Text>
        <Text>Price: ${order.price}</Text>
        {order.imageLink && <Text>Image: {order.imageLink}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#333",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ReviewScreen;
