import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import NavBar from '../components/Navbar';

// Define an array of image paths
const imagePaths = [
  require('../assets/photos/forest.jpg'),
  require('../assets/photos/flower.jpg'),
  require('../assets/photos/trees.jpg'),
  require('../assets/photos/monalisa.jpg'),
  require('../assets/photos/vangogh.jpg'),
  require('../assets/photos/pearl.jpg'),
  require('../assets/photos/scream.jpg'),
  require('../assets/photos/purple.jpg'),
  require('../assets/photos/mountain.jpg'),
  require('../assets/photos/grass.jpg'),
  require('../assets/photos/building.jpg'),
  require('../assets/photos/man.jpg'),
  require('../assets/photos/hand.jpg'),
  require('../assets/photos/gray.jpg'),
  require('../assets/photos/path.jpg'),
  require('../assets/photos/animal.jpg'),
  require('../assets/photos/sunset.jpg'),
  require('../assets/photos/deer.jpg'),
  // Add more image paths as needed
];

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const HomeScreen = () => {
  const imageRows = chunkArray(imagePaths, 3);

  return (
    <View style={styles.container}>
      <NavBar style={styles.navbar} />
      {/* <Text>Welcome to Immpression LLC</Text> */}
      <ScrollView horizontal>
        <View style={styles.columnsContainer}>
          {imageRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.column}>
              {row.map((path, index) => (
                <Image
                  key={index}
                  source={path}
                  style={styles.image}
                />
              ))}
            </View>
          ))}
          {/* Empty view to create space at the bottom */}
          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
  },
  column: {
    marginRight: 10, // Margin between columns
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 10, // Margin between images in a column
    borderRadius: 10,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure the navbar is above the images
  },
  bottomSpace: {
    height: 20, // Adjust the height as needed for space at the bottom
  },
});

export default HomeScreen;
