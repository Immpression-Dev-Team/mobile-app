import React from 'react';
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';
import ScrollBar from './ScrollBar';

const ImageScreen = ({ route, navigation }) => {
  const { image, artistName, artTitle, artYear, artDescription, artType } = route.params;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <Image source={image} style={styles.fullImage} />
      <Text style={styles.artTitle}>{artTitle}</Text>
      <ScrollBar />
      <View style={styles.artistYearContainer}>
        <Text style={styles.artistName}>{artistName}</Text>
        <Text style={styles.artYear}>{artYear}</Text>
      </View>

      <Text style={styles.artType}>{artType}</Text>
      <Text style={styles.artDescription}>{artDescription}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
  },
  fullImage: {
    width: 350,
    height: 400,
    resizeMode: 'contain',
  },
  artTitle: {
    color: 'blue',
    fontSize: 20,
    marginTop: 10,
  },
  artistYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  artistName: {
    color: 'black',
    fontSize: 18,
  },
  artYear: {
    color: 'black',
    fontSize: 18,
  },
  artDescription: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  },
  artType: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  }
});

export default ImageScreen;
