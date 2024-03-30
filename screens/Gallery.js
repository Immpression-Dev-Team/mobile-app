import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../components/Navbar'

const GalleryScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      <Text>My Gallery</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
});

export default GalleryScreen;
