import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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

import ScreenNoFooterTemplate from './Template/ScreenNoFooterTemplate';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout, userData } = useAuth();

  // only navigate when userData is not null (that means already logged in)
  useEffect(() => {
    if (!userData) {
      console.log('Now back to guest login');
      navigation.navigate('Login');
    }
  }, [userData]);

  // handler for log out
  const handleLogout = async () => {
    try {
      console.log('handleLogout');
      const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        await logout();
        console.log('Logged out successfully:', userData);
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

  // options on setting screen
  const options = [
    {
      label: 'Log out',
      iconUrl: logoutIcon,
      onPress: handleLogout,
    },
    // {
    //   label: 'Add Account',
    //   iconUrl: addAccountIcon,
    //   onPress: handleAddAccount,
    // },
    {
      label: 'Account Details', // Changed from 'Account' to 'Account Details'
      iconUrl: userIcon,
      onPress: () => navigation.navigate('AccountDetails'), // Navigate to the new screen
    },
    // {
    //   label: 'Privacy',
    //   iconUrl: lockIcon,
    // },
    // {
    //   label: 'Notifications',
    //   iconUrl: notificationIcon,
    // },
    // {
    //   label: 'App Language',
    //   iconUrl: webIcon,
    // },
    // {
    //   label: 'Device Permissions',
    //   iconUrl: deviceIcon,
    // },
    // {
    //   label: 'Help',
    //   iconUrl: helpIcon,
    // },
    // {
    //   label: 'Invite a friend',
    //   iconUrl: friendsIcon,
    // },
    {
      label: 'Delete Account',
      onPress: () => navigation.navigate('DeleteAccount'),
    },
  ];

  const renderItem = ({ item }) => (
    <>
      <SettingsItem
        item={item}
        handleClick={item.onPress || (() => console.log(`Navigate to ${item.label}`))}
      />
      {item.label === 'Add Account' && <View style={styles.horizontalDivider} />}
    </>
  );

  return (
    <ScreenNoFooterTemplate>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.listContent}
      />
    </ScreenNoFooterTemplate>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 20,
  },
});

export default SettingsScreen;
