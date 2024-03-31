import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../components/Navbar'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      <Text>Welcome to Immpression LLC</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    
  },
});

export default HomeScreen;
