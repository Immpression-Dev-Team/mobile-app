import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../components/Navbar'
import SlidersPractice from '../components/SliderPractice'

const GalleryScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      {/* <Text>Gallery</Text> */}
      <SlidersPractice />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
});

export default GalleryScreen;
