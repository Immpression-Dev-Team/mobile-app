import React from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import ScrollBar from './ScrollBar';

const ImageScreen = ({ route, navigation }) => {
  const { image, artistName, artTitle, artYear, artDescription, artType } = route.params;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.fullImage} />
      </View>
      <ScrollView contentContainerStyle={styles.textContainer}>
        <Text style={styles.artTitle}>{artTitle}</Text>
        <ScrollBar />
        <View style={styles.artistNameYearContainer}>
          <Text style={styles.artistName}>{artistName}</Text>
          <Text style={styles.artYear}>{artYear}</Text>
        </View>
        <Text style={styles.artType}>{artType}</Text>
        <Text style={styles.artDescription}>{artDescription}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  imageContainer: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  artTitle: {
    color: 'blue',
    fontSize: 20,
    marginTop: 10,
  },
  artistNameYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  artistName: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
  },
  artYear: {
    color: 'black',
    fontSize: 18,
    marginTop: 5,
  },
  artType: {
    color: 'black',
    fontSize: 18,
    marginTop: 5,
  },
  artDescription: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  }
});

export default ImageScreen;
