import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "../state/AuthProvider";
import { updateTrackingNumber } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";

const SubmitTrackingNumber = ({ navigation, route }) => {
  const { orderData } = route.params || {};
  const { token } = useAuth();
  
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInput = () => {
    if (!trackingNumber.trim()) {
      Alert.alert("Error", "Please enter a tracking number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    setIsSubmitting(true);

    try {
      await updateTrackingNumber(orderData.orderId, trackingNumber.trim(), token);
      
      Alert.alert(
        "Success",
        "Tracking number submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting tracking number:", error);
      Alert.alert("Error", "Failed to submit tracking number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenTemplate>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Submit Tracking Number</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.spacingBelowHeader} />
          
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          {orderData && (
            <View style={styles.orderCard}>
              {orderData.imageLink && (
                <Image
                  source={{ uri: orderData.imageLink }}
                  style={styles.artworkImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.orderInfo}>
                <Text style={styles.artworkTitle}>{orderData.artName || "Artwork"}</Text>
                {orderData.artistName && (
                  <Text style={styles.artistName}>By: {orderData.artistName}</Text>
                )}
                {orderData.price && (
                  <Text style={styles.price}>${orderData.price.toFixed(2)}</Text>
                )}
                <Text style={styles.orderDate}>
                  Order placed: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Tracking Information</Text>
            <Text style={styles.instruction}>
              Please provide the shipping tracking number for this order:
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter tracking number (e.g., 1Z123456789)"
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!trackingNumber.trim() || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!trackingNumber.trim() || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit Tracking Number"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  spacingBelowHeader: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E2A3A",
    marginBottom: 15,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 30,
  },
  artworkImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  orderInfo: {
    marginLeft: 15,
    flex: 1,
  },
  artworkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2A3A",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#888",
  },
  formContainer: {
    flex: 1,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 25,
    color: "#1E2A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: "#1E2A3A",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default SubmitTrackingNumber;