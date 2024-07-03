// screens/StatisticsScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import Navbar from '../components/Navbar';

const StatisticsScreen = () => {
  const imagePaths = [
    { uri: 'https://via.placeholder.com/150', artistName: '@OnlineArtist' },
    { path: require('../assets/art/art5.png'), artistName: '@Artist1' },
    { path: require('../assets/art/art2.png'), artistName: '@Artist2' },
    { path: require('../assets/art/batman.png'), artistName: '@BruceWayne' },
    { path: require('../assets/art/art3.png'), artistName: '@Artist3' },
    { path: require('../assets/art/art4.png'), artistName: '@Artist4' },
    { path: require('../assets/art/art1.jpg'), artistName: '@Artist5' },
    { path: require('../assets/art/art6.png'), artistName: '@Artist6' },
    { path: require('../assets/photos/mountain.jpg'), artistName: '@Artist7' },
    { path: require('../assets/photos/grass.jpg'), artistName: '@Artist8' },
    { path: require('../assets/photos/building.jpg'), artistName: '@Artist9' },
    { path: require('../assets/photos/man.jpg'), artistName: '@Artist10' },
    { path: require('../assets/photos/hand.jpg'), artistName: '@Artist11' },
    { path: require('../assets/photos/gray.jpg'), artistName: '@Artist12' },
    { path: require('../assets/photos/path.jpg'), artistName: '@Artist13' },
    { path: require('../assets/photos/animal.jpg'), artistName: '@Artist14' },
    { path: require('../assets/photos/sunset.jpg'), artistName: '@Artist15' },
    { path: require('../assets/photos/deer.jpg'), artistName: '@Artist16' },
    { path: require('../assets/art/superman.png'), artistName: '@Clark Kent' },
    { path: require('../assets/art/spiderman.png'), artistName: '@PeterParker' },
    { path: require('../assets/art/tajmahal.png'), artistName: '@NavjotKaur' },
  ];

  return (
    <>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          {imagePaths.map((image, index) => {
            // console.log(`Rendering image at index ${index} with source: ${image.path || image.uri}`); 
            return (
              <View key={index} style={styles.imageContainer}>
                <Image 
                  source={image.path ? image.path : { uri: image.uri }} 
                  style={styles.image} 
                  onError={(error) => console.log(`Failed to load image at index ${index}: ${error.nativeEvent.error}`)}
                //   onLoad={() => console.log(`Image at index ${index} loaded successfully`)}
                />
                <Text style={styles.artistName}>{image.artistName}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '30%', // Adjust this to fit 3 images per row
    aspectRatio: 1, // Ensures the container is square
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  artistName: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default StatisticsScreen;
