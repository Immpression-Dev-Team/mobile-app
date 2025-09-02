import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../state/AuthProvider";
import { updateTrackingNumber } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";

// Normalize: remove spaces, keep dashes, uppercase
const normalizeTN = (s = "") => s.replace(/\s+/g, "").toUpperCase();

// Lightweight carrier guesser
const guessCarrier = (code) => {
  const s = String(code || "").replace(/\s/g, "");
  if (/^1Z[0-9A-Z]{16}$/i.test(s)) return "UPS";                 // UPS common
  if (/^\d{12}$/.test(s) || /^\d{15}$/.test(s)) return "FedEx";  // FedEx common
  if (/^\d{20,22}$/.test(s)) return "USPS";                      // USPS long numeric
  if (/^9\d{21,25}$/i.test(s)) return "USPS";                    // USPS starting 9
  if (/^\d{10}$/.test(s)) return "DHL";                          // older DHL eCom
  return null;
};

const SubmitTrackingNumber = ({ navigation, route }) => {
  const { orderData } = route.params || {};
  const { token } = useAuth();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const submitLock = useRef(false);

  const tnNormalized = useMemo(() => normalizeTN(trackingNumber), [trackingNumber]);
  const carrierGuess = useMemo(() => guessCarrier(tnNormalized), [tnNormalized]);

  const validateInput = () => {
    const tn = tnNormalized;
    if (!tn) {
      setErrorText("Please enter a tracking number.");
      return false;
    }
    // Soft validation (do not block, just warn)
    if (!/^[A-Z0-9-]{8,35}$/i.test(tn)) {
      setErrorText("That tracking number looks unusual. You can still submit.");
      return true;
    }
    setErrorText("");
    return true;
  };

  const handleSubmit = async () => {
    if (!orderData?.orderId) {
      Alert.alert("Error", "Missing order ID for this order.");
      return;
    }
    if (submitLock.current || isSubmitting) return;
    if (!validateInput()) return;

    submitLock.current = true;
    setIsSubmitting(true);
    try {
      const res = await updateTrackingNumber(
        orderData.orderId,
        tnNormalized,
        token,
        carrierGuess?.toLowerCase() // optional; backend can auto-detect
      );

      const status = res?.data?.shipping?.shipmentStatus?.replace(/_/g, " ") || "saved";
      const msg = res?.message || `Tracking ${status}.`;
      Alert.alert("Success", msg, [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert("Error", error?.message || "Failed to submit tracking number.");
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <ScreenTemplate>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
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
                <Image source={{ uri: orderData.imageLink }} style={styles.artworkImage} resizeMode="cover" />
              )}
              <View style={styles.orderInfo}>
                <Text style={styles.artworkTitle}>{orderData.artName || "Artwork"}</Text>
                {!!orderData.artistName && <Text style={styles.artistName}>By: {orderData.artistName}</Text>}
                {typeof orderData.price === "number" && (
                  <Text style={styles.price}>${orderData.price.toFixed(2)}</Text>
                )}
                <Text style={styles.orderDate}>Order placed: {new Date().toLocaleDateString()}</Text>
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
              onChangeText={(t) => {
                // Restrict to typical chars while typing (keeps pasted dashes)
                const cleaned = t.replace(/[^0-9a-zA-Z- ]/g, "");
                setTrackingNumber(cleaned);
                if (errorText) setErrorText("");
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isSubmitting}
              maxLength={35}
              inputMode="text"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Carrier hint chip */}
            <View style={{ minHeight: 22, marginBottom: 10 }}>
              {!!carrierGuess && (
                <View style={styles.carrierChip}>
                  <Text style={styles.carrierChipText}>Guessed Carrier: {carrierGuess}</Text>
                </View>
              )}
            </View>

            {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!tnNormalized || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!tnNormalized || isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Tracking Number</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  goBackButton: { backgroundColor: "#f0f0f0", padding: 8, borderRadius: 8 },
  arrow: { fontSize: 18, color: "#333", fontWeight: "600" },
  header: { fontSize: 20, fontWeight: "600", marginLeft: 12, color: "#1E2A3A" },
  content: { flex: 1, paddingHorizontal: 20 },
  spacingBelowHeader: { marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1E2A3A", marginBottom: 15 },
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
  artworkImage: { width: 80, height: 80, borderRadius: 8 },
  orderInfo: { marginLeft: 15, flex: 1 },
  artworkTitle: { fontSize: 16, fontWeight: "600", color: "#1E2A3A", marginBottom: 4 },
  artistName: { fontSize: 14, color: "#555", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#007AFF", marginBottom: 4 },
  orderDate: { fontSize: 12, color: "#888" },
  formContainer: { flex: 1 },
  instruction: { fontSize: 14, color: "#666", marginBottom: 12, lineHeight: 20 },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 10,
    color: "#1E2A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  carrierChip: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E9EEF5",
  },
  carrierChipText: { fontSize: 12, color: "#1E2A3A", fontWeight: "600" },
  errorText: { color: "#b91c1c", marginBottom: 10 },
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
    marginTop: 10,
  },
  submitButtonDisabled: { backgroundColor: "#ccc", shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
});

export default SubmitTrackingNumber;
