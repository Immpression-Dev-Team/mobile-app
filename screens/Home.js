import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import NavBar from '../components/Navbar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar style={styles.navbar}/>
      {/* <Text>Welcome to Immpression LLC</Text> */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/photos/forest.jpg')} // Replace with your placeholder image
          style={styles.image}
        />
        <Image 
          source={require('../assets/photos/flower.jpg')} // Replace with your placeholder image
          style={styles.image}
        />
                <Image 
          source={require('../assets/photos/trees.jpg')} // Replace with your placeholder image
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
    justifyContent: 'space-between', // Adjusted to distribute space between images
    marginTop: 20,
  },  
  image: {
    width: 110,
    height: 110,
    margin: 10,
    borderRadius: 10,
  },
});

export default HomeScreen;
