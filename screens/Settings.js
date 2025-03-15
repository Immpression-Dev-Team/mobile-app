import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../API_URL';
import { useAuth } from "../state/AuthProvider";
import ScreenTemplate from './Template/ScreenTemplate';

// Import icons
import userIcon from '../assets/user.png';
import logoutIcon from '../assets/logout.png';
import deleteIcon from '../assets/icons/delete_icon.png';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout, userData } = useAuth();

  // Navigate to login if user is not authenticated
  useEffect(() => {
    if (!userData) {
      console.log('Now back to guest login');
      navigation.navigate('Login');
    }
  }, [userData]);

  // Logout handler
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

  // Settings options
  const options = [
    {
      label: 'Account Details',
      iconUrl: userIcon,
      onPress: () => navigation.navigate('AccountDetails'),
    },
    {
      label: 'Log Out',
      iconUrl: logoutIcon,
      onPress: handleLogout,
    },
    {
      label: 'Delete Account',
      iconUrl: deleteIcon,
      onPress: () => navigation.navigate('DeleteAccount'),
      isDelete: true, // Special flag for styling
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.optionContainer} onPress={item.onPress}>
      <View style={styles.optionContent}>
        <Image source={item.iconUrl} style={styles.icon} />
        <Text style={[styles.optionLabel, item.isDelete && styles.deleteLabel]}>
          {item.label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={item.isDelete ? "red" : "#888"} />
    </TouchableOpacity>
  );

  return (
    <ScreenTemplate>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.listContent}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24, // Ensure all icons are the same size
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  optionLabel: {
    fontSize: 16,
    color: '#000',
  },
  deleteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default SettingsScreen;
