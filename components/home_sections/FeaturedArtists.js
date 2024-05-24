import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const imagePaths = [
  require('../../assets/artists/artist1.png'),
  require('../../assets/artists/artist2.png'),
  require('../../assets/artists/artist9.png'),
  require('../../assets/artists/artist3.png'),
  require('../../assets/artists/artist12.png'),
  require('../../assets/artists/artist6.png'),
  require('../../assets/artists/artist4.png'),
  require('../../assets/artists/artist7.png'),
  require('../../assets/artists/artist8.png'),
  require('../../assets/artists/artist10.png'),
  require('../../assets/artists/artist5.png'),
  require('../../assets/artists/artist11.png'),
  require('../../assets/artists/artist13.png'),
  require('../../assets/artists/artist14.png'),
  require('../../assets/artists/artist15.png'),
  require('../../assets/artists/artist16.png'),
//   require('../../assets/art/art7.png'),
//   require('../../assets/art/art8.png'),
];

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const FeaturedArtists = () => {
  const imageChunks = chunkArray(imagePaths, 2); // Chunk into groups of 3 images

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
    color: 'white',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 100,
  },
  scrollView: {
    flexDirection: 'row',
  },
  column: {
    marginRight: 5, // Margin between columns
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 5, // Margin between images in a column
    borderRadius: 5,
  },
});

export default FeaturedArtists;
