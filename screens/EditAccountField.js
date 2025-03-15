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
import { updateUserProfile } from "../API/API"; // Import the update API function
import ScreenTemplate from "./Template/ScreenTemplate"; 

const EditAccountFieldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { field, value } = route.params;
  const [input, setInput] = useState(value);
  const { userData, setUserData } = useAuth(); // Get auth state and updater function
  const token = userData?.token;

  // Handle profile update
  const handleUpdate = async () => {
    if (!input.trim()) {
      Alert.alert("Error", `${field} cannot be empty.`);
      return;
    }

    try {
      const updatedData = { [field.toLowerCase()]: input }; // Create dynamic payload
      const response = await updateUserProfile(updatedData, token);

      if (response.success) {
        Alert.alert("Success", `${field} updated successfully.`);
        
        // Update the local user state with the new value
        setUserData((prev) => ({
          ...prev,
          [field.toLowerCase()]: input,
        }));

        navigation.goBack(); // Navigate back to Account Details
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>{field}</Text>
          <TouchableOpacity onPress={handleUpdate} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <Text style={styles.label}>{field}</Text>
        <TextInput 
          style={styles.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder={`Enter new ${field.toLowerCase()}`} 
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
});

export default EditAccountFieldScreen;
