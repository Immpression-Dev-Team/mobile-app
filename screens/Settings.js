import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import NavBar from "../components/Navbar";
import SettingsItem from "../components/SettingsItem";
import helpIcon from "../assets/question.png";
import deviceIcon from "../assets/device.png";
import friendsIcon from "../assets/friends.png";
import lockIcon from "../assets/lock.png";
import notificationIcon from "../assets/notification.png";
import userIcon from "../assets/user.png";
import webIcon from "../assets/web.png";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const options = [
  {
    label: "Account",
    iconUrl: userIcon,
  },
  {
    label: "Privacy",
    iconUrl: lockIcon,
  },
  {
    label: "Notifications",
    iconUrl: notificationIcon,
  },
  {
    label: "App Language",
    iconUrl: webIcon,
  },
  {
    label: "Device Permissions",
    iconUrl: deviceIcon,
  },
  {
    label: "Help",
    iconUrl: helpIcon,
  },
  {
    label: "Invite a friend",
    iconUrl: friendsIcon,
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/logout",
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        navigateTo("Home");
      } else {
        console.log("Logout failed");
      }
    } catch (err) {
      console.log("Error during logout:", err);
    }
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.settingsContainer}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.horizontalDivider} />
        <FlatList
          data={options}
          renderItem={({ item }) => <SettingsItem item={item} />}
        />
        <View style={styles.horizontalDivider} />
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.logoutBtn}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.addAccountBtn}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const btn = {
  textAlign: "center",
  fontSize: 28,
  paddingVertical: 15,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "semibold",
    paddingHorizontal: 20,
  },
  logoutBtn: {
    ...btn,
    color: "red",
  },
  addAccountBtn: {
    ...btn,
    color: "blue",
  },
});

export default SettingsScreen;
