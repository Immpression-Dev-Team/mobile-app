import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../components/Navbar'

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      <Text>Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 

  },
});

export default SettingsScreen;
