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

// Normalize: remove spaces, uppercase
const normalizeTN = (s = "") => s.replace(/\s+/g, "").toUpperCase();

// Carriers
const CARRIERS = ["UPS", "USPS", "FEDEX"];

/** Brand tokens: used for borders/labels when selected */
const BRAND = {
  UPS: { border: "#5E3B17" },
  USPS: { border: "#0071CE" },
  FEDEX: { border: "#4D148C" },
};

// Local logo assets (update paths if needed)
const LOGOS = {
  UPS: require("../assets/shipping/ups.png"),
  USPS: require("../assets/shipping/usps.png"),
  FEDEX: require("../assets/shipping/fedex.png"),
};

// Per-carrier validators (first-pass only; we don't hard-block on these)
const isUPS = (s) => /^1Z[0-9A-Z]{16}$/.test(s);
const isUSPS = (s) => /^(\d{20,22}|\d{26})$/.test(s);
const isFedEx = (s) => /^(\d{12}|\d{15}|\d{20}|\d{22})$/.test(s);
const validators = { UPS: isUPS, USPS: isUSPS, FEDEX: isFedEx };

// Lightweight carrier guess (for hint/auto-select)
const guessCarrier = (code) => {
  const s = String(code || "").replace(/\s/g, "");
  if (/^1Z[0-9A-Z]{16}$/i.test(s)) return "UPS";
  if (/^\d{12}$/.test(s) || /^\d{15}$/.test(s)) return "FEDEX";
  if (/^\d{20,22}$/.test(s)) return "USPS";
  if (/^9\d{21,25}$/i.test(s)) return "USPS";
  return null;
};

/** Wide, pill-style carrier button */
const CarrierButton = ({ carrier, selected, onPress }) => {
  const palette = BRAND[carrier];
  const logo = LOGOS[carrier];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.carrierItemWrap, selected && { transform: [{ scale: 0.98 }] }]}
    >
      <View
        style={[
          styles.carrierTileWide,
          {
            borderColor: selected ? palette.border : "#E5E7EB",
            shadowColor: selected ? palette.border : "#000",
          },
        ]}
      >
        <Image source={logo} style={styles.logoSmall} resizeMode="contain" />
        <Text
          style={[
            styles.carrierLabel,
            { color: selected ? palette.border : "#374151" },
          ]}
        >
          {carrier}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SubmitTrackingNumber = ({ navigation, route }) => {
  const { orderData, prefill } = route.params || {};
  const { token } = useAuth();

  const [selectedCarrier, setSelectedCarrier] = useState(
    (prefill?.carrier && prefill.carrier.toUpperCase()) || null
  );
  const [trackingNumber, setTrackingNumber] = useState(prefill?.trackingNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const submitLock = useRef(false);

  const tnNormalized = useMemo(() => normalizeTN(trackingNumber), [trackingNumber]);
  const carrierHint = useMemo(() => guessCarrier(tnNormalized), [tnNormalized]);

  const validByCarrier = useMemo(() => {
    const c = selectedCarrier || carrierHint;
    if (!c) return false;
    const v = validators[c];
    return v ? v(tnNormalized) : false;
  }, [selectedCarrier, carrierHint, tnNormalized]);

  const onSelectCarrier = (c) => {
    setSelectedCarrier(c);
    if (errorText) setErrorText("");
  };

  const placeholderByCarrier =
    selectedCarrier === "UPS"
      ? "1Zxxxxxxxxxxxxxxxx"
      : selectedCarrier === "USPS"
      ? "20–26 digits"
      : selectedCarrier === "FEDEX"
      ? "12/15/20/22 digits"
      : "Select a carrier or start typing";

  const handleSubmit = async () => {
    if (!orderData?.orderId) {
      Alert.alert("Error", "Missing order ID for this order.");
      return;
    }
    if (!tnNormalized) {
      setErrorText("Please enter a tracking number.");
      return;
    }

    // Prefer explicit selection, else use guess; let backend be the authority.
    const chosenCarrier = (selectedCarrier || carrierHint || "").toLowerCase() || undefined;

    // Soft validation (do not block)
    if (!validByCarrier) {
      setErrorText(
        "Format looks unusual for the selected carrier. You can still submit — we’ll verify with the carrier."
      );
    }

    if (submitLock.current || isSubmitting) return;

    submitLock.current = true;
    setIsSubmitting(true);
    try {
      // IMPORTANT: no forceMock flag here
      const res = await updateTrackingNumber(
        orderData.orderId,
        tnNormalized,
        token,
        chosenCarrier
      );

      const status =
        res?.data?.shipping?.shipmentStatus?.replace(/_/g, " ") || "saved";
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
        {/* Header */}
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
              {orderData.imageLink ? (
                <Image
                  source={{ uri: orderData.imageLink }}
                  style={styles.artworkImage}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.orderInfo}>
                <Text style={styles.artworkTitle}>{orderData.artName || "Artwork"}</Text>
                {!!orderData.artistName && (
                  <Text style={styles.artistName}>By: {orderData.artistName}</Text>
                )}
                {typeof orderData.price === "number" && (
                  <Text style={styles.price}>${orderData.price.toFixed(2)}</Text>
                )}
                <Text style={styles.orderDate}>
                  Order placed: {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {/* Carrier Selection */}
          <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Select Carrier</Text>
          <View style={styles.carrierRow}>
            {CARRIERS.map((c) => (
              <CarrierButton
                key={c}
                carrier={c}
                selected={selectedCarrier === c}
                onPress={() => onSelectCarrier(c)}
              />
            ))}
          </View>

          {/* Tracking input */}
          <View style={{ marginTop: 6 }}>
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Tracking Number</Text>
            <Text style={styles.instruction}>
              Enter the tracking number{selectedCarrier ? ` for ${selectedCarrier}` : ""}.
            </Text>

            <TextInput
              style={styles.input}
              placeholder={placeholderByCarrier}
              value={trackingNumber}
              onChangeText={(t) => {
                const cleaned = t.replace(/[^0-9a-zA-Z- ]/g, "");
                setTrackingNumber(cleaned);
                if (errorText) setErrorText("");
                // Auto-select guessed carrier if none chosen yet
                const g = guessCarrier(cleaned);
                if (!selectedCarrier && g) setSelectedCarrier(g);
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isSubmitting}
              maxLength={35}
              inputMode="text"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Validity + hint */}
            <View style={styles.hintsRow}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={[
                    styles.validPill,
                    tnNormalized
                      ? validByCarrier
                        ? styles.validOk
                        : styles.validSoft
                      : styles.validNeutral,
                  ]}
                >
                  <Text style={styles.validPillText}>
                    {tnNormalized
                      ? validByCarrier
                        ? "Looks valid"
                        : "Unusual format (ok to submit)"
                      : "Awaiting number"}
                  </Text>
                </View>

                {!!carrierHint && carrierHint !== selectedCarrier && tnNormalized.length > 0 && (
                  <View style={styles.hintChip}>
                    <Text style={styles.hintChipText}>Guessed: {carrierHint}</Text>
                  </View>
                )}
              </View>
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
                <Text style={styles.submitButtonText}>Submit</Text>
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
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1E2A3A", marginBottom: 12 },

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
    marginBottom: 24,
  },
  artworkImage: { width: 80, height: 80, borderRadius: 8 },
  orderInfo: { marginLeft: 15, flex: 1 },
  artworkTitle: { fontSize: 16, fontWeight: "600", color: "#1E2A3A", marginBottom: 4 },
  artistName: { fontSize: 14, color: "#555", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#007AFF", marginBottom: 4 },
  orderDate: { fontSize: 12, color: "#888" },

  // Carrier row
  carrierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },
  carrierItemWrap: { flex: 1 },
  carrierTileWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  logoSmall: { width: 28, height: 28, marginRight: 8 },
  carrierLabel: { fontSize: 14, fontWeight: "800", letterSpacing: 0.2 },

  // Tracking input
  instruction: { fontSize: 14, color: "#666", marginBottom: 10, lineHeight: 20 },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: -20,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
    color: "#1E2A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Hints / validation
  hintsRow: { minHeight: 28, marginBottom: 4, flexDirection: "row", alignItems: "center" },
  validPill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, marginRight: 8 },
  validNeutral: { backgroundColor: "#E5E7EB" },
  validOk: { backgroundColor: "#D1FAE5" },
  validSoft: { backgroundColor: "#FEF3C7" }, // warning (not blocking)
  validPillText: { fontSize: 11, fontWeight: "700", color: "#111827" },
  hintChip: {
    backgroundColor: "#E9EEF5",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  hintChipText: { fontSize: 11, fontWeight: "700", color: "#1E2A3A" },

  errorText: { color: "#b91c1c", marginTop: 6 },

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
    marginTop: 12,
  },
  submitButtonDisabled: { backgroundColor: "#A7B0B9" },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
});

export default SubmitTrackingNumber;
