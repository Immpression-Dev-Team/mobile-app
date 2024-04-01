import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import NavBar from '../components/Navbar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar style={styles.navbar}/>
      <Text>Welcome to Immpression LLC</Text>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/Logo_T.png')} // Replace with your placeholder image
          style={styles.image}
        />
        <Image 
          source={require('../assets/Logo_T.png')} // Replace with your placeholder image
          style={styles.image}
        />
        {/* Add more images as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 

  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
  },
});

export default HomeScreen;
