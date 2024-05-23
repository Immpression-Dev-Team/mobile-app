import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const imagePaths = [
  require('../../assets/photos/mountain.jpg'),
  require('../../assets/photos/grass.jpg'),
  require('../../assets/photos/building.jpg'),
  require('../../assets/photos/man.jpg'),
  require('../../assets/photos/hand.jpg'),
  require('../../assets/photos/gray.jpg'),
  require('../../assets/photos/path.jpg'),
  require('../../assets/photos/animal.jpg'),
  require('../../assets/photos/sunset.jpg'),
  require('../../assets/photos/deer.jpg'),
  require('../../assets/art/art1.jpg'),
  require('../../assets/art/art2.png'),
  require('../../assets/art/art3.png'),
  require('../../assets/art/art4.png'),
  require('../../assets/art/art5.png'),
  require('../../assets/art/art6.png'),
  require('../../assets/art/art7.png'),
  require('../../assets/art/art8.png'),
];

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const FeaturedArtists = () => {
  const imageChunks = chunkArray(imagePaths, 3); // Chunk into groups of 3 images

  return (
    <View style={styles.section}>
      <Text style={styles.header}>Featured artists</Text>
      <ScrollView horizontal style={styles.scrollView}>
        {imageChunks.map((chunk, chunkIndex) => (
          <View key={chunkIndex} style={styles.column}>
            {chunk.map((path, index) => (
              <Image
                key={index}
                source={path}
                style={styles.image}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
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
});

export default FeaturedArtists;
