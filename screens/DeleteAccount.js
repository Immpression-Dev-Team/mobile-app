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
import ScreenTemplate from "./Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import axios from "axios";
import { API_URL } from "../config";

const DeleteAccountScreen = ({ navigation }) => {
  const { logout, userData } = useAuth();
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText.toLowerCase() !== "delete my account") {
      Alert.alert(
        "Invalid Confirmation",
        "Please type 'delete my account' exactly to confirm."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(`${API_URL}/delete-account`, {
        data: { userId: userData._id },
        withCredentials: true,
      });

      if (response.data.success) {
        Alert.alert("Account Deleted", "Your account has been deleted.");
        await logout();
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message || "Deletion failed.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "An error occurred while deleting your account.");
    } finally {
      setLoading(false);
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
        <Text style={styles.header}>Delete Account</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Deleting your account is permanent and cannot be undone. All your data
          will be removed from our systems. If you are sure, type "delete my
          account" below and confirm.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Type 'delete my account'"
          value={confirmationText}
          onChangeText={setConfirmationText}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Deleting..." : "Delete My Account"}
          </Text>
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
  content: {
    flexGrow: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#6c757d",
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
    backgroundColor: "#d9534f",
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
  disabledButton: {
    backgroundColor: "#e0aeb1",
  },
});

export default DeleteAccountScreen;
