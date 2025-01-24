import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../state/AuthProvider";
import { deleteAccount } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";

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
      const response = await deleteAccount(userData.token);

      if (response.success) {
        Alert.alert("Account Deleted", "Your account has been deleted.");
        await logout(); // Log the user out after deletion
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.error || "Account deletion failed.");
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
      <View style={styles.container}>
        <Text style={styles.header}>Delete Account</Text>
        <Text style={styles.description}>
          Deleting your account is permanent and cannot be undone. If you’re
          sure, type “delete my account” below to confirm.
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
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#d9534f",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#e0aeb1",
  },
});

export default DeleteAccountScreen;
