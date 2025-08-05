import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../state/AuthProvider"; 
import { updateUserProfile, updateUserPassword } from "../API/API"; // Import the new function
import ScreenTemplate from "./Template/ScreenTemplate"; 

const EditAccountFieldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { field, value } = route.params;
  const [input, setInput] = useState(value);
  const [currentPassword, setCurrentPassword] = useState("");
  const { userData, setUserData, logout } = useAuth();
  const token = userData?.token;

  const handleUpdate = async () => {
    const trimmedInput = input.trim();
    if (!input.trim()) {
      Alert.alert("Error", `${field} cannot be empty.`);
      return;
    }

    try {
      let updatedData;
      let response;

      if (field === "Password") {
        const trimmedCurrentPassword = currentPassword.trim();
        if (!trimmedCurrentPassword) {
          Alert.alert("Error", "Current password cannot be empty.");
          return;
        }
        // Validate new password length on the frontend
        if (input.length < 8) {
          Alert.alert("Error", "New password must be at least 8 characters long.");
          return;
        }
        if (input.length > 30) {
          Alert.alert("Error", "New password must be less than 30 characters.");
          return;
        }
        updatedData = { currentPassword: trimmedCurrentPassword, newPassword: input };
        response = await updateUserPassword(updatedData, token); // Use the new function
      } else {
        updatedData = { [field.toLowerCase()]: input };
        response = await updateUserProfile(updatedData, token);
      }

      if (response.success) {
        Alert.alert("Success", `${field} updated successfully.`);

        if (field === "Password") {
          await logout(); // Clear the token and user data
          navigation.navigate("Home"); // Redirect to login screen
        } else {
          setUserData((prev) => ({
            ...prev,
            [field.toLowerCase()]: input,
          }));
          navigation.goBack();
        }
      } else {
        Alert.alert("Error", response.error || "Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>{field}</Text>
          <TouchableOpacity onPress={handleUpdate} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

        {field === "Password" && (
          <>
            <Text style={styles.label}>Current Password</Text>
            <TextInput 
              style={styles.input} 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              placeholder="Enter current password" 
              secureTextEntry
              autoCapitalize="none"
            />
          </>
        )}

        <Text style={styles.label}>{field === "Password" ? "New Password" : field}</Text>
        <TextInput 
          style={styles.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder={`Enter new ${field.toLowerCase()}`} 
          secureTextEntry={field === "Password"}
          autoCapitalize="none"
        />
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  backButton: {
    padding: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  nextButton: {
    padding: 5,
  },
  nextText: {
    fontSize: 16,
    color: "#888",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
});

export default EditAccountFieldScreen;