import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import NavBar from '../components/Navbar';

// Define an array of image paths
const imagePaths = [
  require('../assets/photos/forest.jpg'),
  require('../assets/photos/flower.jpg'),
  require('../assets/photos/trees.jpg'),
  require('../assets/photos/monalisa.jpg'),
  require('../assets/photos/vangogh.jpg'),
  require('../assets/photos/pearl.jpg'),
  // Add more image paths as needed
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar style={styles.navbar} />
      {/* <Text>Welcome to Immpression LLC</Text> */}
      <View style={styles.imageContainer}>
        {imagePaths.map((path, index) => (
          <Image
            key={index}
            source={path}
            style={styles.image}
          />
        ))}
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
