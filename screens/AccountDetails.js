import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from "react-native";
import { useAuth } from "../state/AuthProvider";
import { getUserProfile } from "../API/API";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icons for back button & arrow

import ScreenTemplate from "./Template/ScreenTemplate";

const AccountDetailsScreen = () => {
  const navigation = useNavigation(); // Get navigation prop
  const { userData } = useAuth(); // Get auth state
  const token = userData?.token; // Extract token
  const [profileName, setProfileName] = useState(""); // Default to empty string
  const [email, setEmail] = useState(""); // Default to empty string
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return; // Ensure token exists before making the API call

      try {
        console.log("Fetching user profile...");
        const data = await getUserProfile(token);
        if (data?.user) {
          console.log("User profile data:", data.user);
          setProfileName(data.user.name || "N/A"); // Set profile name
          setEmail(data.user.email || "N/A"); // Set email
        } else {
          console.error("Error: user data is undefined in fetchProfileData");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  if (loading) {
    return (
      <ScreenTemplate>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E2A3A" />
        </View>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Account Management</Text>
        </View>

        <Text style={styles.subHeader}>
          Make changes to your personal information or account type
        </Text>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Your Account</Text>

        {/* Name Row */}
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.text}>{profileName}</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </View>
        </TouchableOpacity>

        {/* Email Row */}
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.text}>{email}</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </View>
        </TouchableOpacity>

        {/* Password Change Option */}
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.text}>Change password</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </View>
        </TouchableOpacity>

      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFF", // Changed back to white
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000", // Changed back to black
  },
  subHeader: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray divider
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#888", // Gray color for secondary text
    marginRight: 10,
  },
});

export default AccountDetailsScreen;
