import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ArtOfTheDay = () => {
  return (
    <View style={styles.container}>
        {/* <Text>Art Of The Day</Text> */}
      <Image
        source={require('../../assets/art/art5.png')} // Replace with your image path
        style={styles.artImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.artTitle}>Self Love</Text>
        <Text style={styles.artistName}>Marcus Morales</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  artImage: {
    width: 150, // Adjust size as needed
    height: 150,
    borderRadius: 0,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  artTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: '#888',
  },
});

export default ArtOfTheDay;
