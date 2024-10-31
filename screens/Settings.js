import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, ImageBackground } from 'react-native';
import NavBar from '../components/Navbar';
import SettingsItem from '../components/SettingsItem';
import helpIcon from '../assets/question.png';
import deviceIcon from '../assets/device.png';
import friendsIcon from '../assets/friends.png';
import lockIcon from '../assets/lock.png';
import notificationIcon from '../assets/notification.png';
import userIcon from '../assets/user.png';
import webIcon from '../assets/web.png';
import logoutIcon from '../assets/logout.png';
import addAccountIcon from '../assets/add_account.png';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from "../state/AuthProvider";


const options = [
  {
    label: 'Log out',
    iconUrl: logoutIcon,
    onPress: 'handleSubmit',
  },
  {
    label: 'Add Account',
    iconUrl: addAccountIcon,
    onPress: 'handleAddAccount',
  },
  {
    label: 'Account',
    iconUrl: userIcon,
  },
  {
    label: 'Privacy',
    iconUrl: lockIcon,
  },
  {
    label: 'Notifications',
    iconUrl: notificationIcon,
  },
  {
    label: 'App Language',
    iconUrl: webIcon,
  },
  {
    label: 'Device Permissions',
    iconUrl: deviceIcon,
  },
  {
    label: 'Help',
    iconUrl: helpIcon,
  },
  {
    label: 'Invite a friend',
    iconUrl: friendsIcon,
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        logout();
        navigation.navigate('Login');
      } else {
        console.log('Logout failed');
      }
    } catch (err) {
      console.log('Error during logout:', err);
    }
  };

  const handleAddAccount = () => {
    console.log('Add Account');
  };

  const handleNavigation = (label) => {
    console.log(`Navigate to ${label}`);
  };

  const renderItem = ({ item }) => (
    <>
      <SettingsItem
        item={item}
        handleClick={
          item.onPress
            ? item.onPress === 'handleSubmit'
              ? handleSubmit
              : handleAddAccount
            : () => handleNavigation(item.label)
        }
      />
      {item.label === 'Add Account' && <View style={styles.horizontalDivider} />}
    </>
  );

  return (
    <View style={styles.container}>
       <ImageBackground
          source={require("../assets/backgrounds/navbar_bg_blue.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >
          <NavBar />
        </ImageBackground>
      
      <View style={styles.settingsContainer}>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  settingsContainer: {
    marginTop: 30,
    flex: 1,
    paddingHorizontal: 10,
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SettingsScreen;
