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
      <View style={styles.textContainer}>
        <Text style={styles.artTitle}>{artTitle}</Text>
        <View horizontal={true} style={styles.scrollBar}>
          <ScrollBar />
        </View>
        <View style={styles.artistNameYearContainer}>
          <Text style={styles.artistName}>{artistName}</Text>
          <View style={styles.verticalLine} />
          <Text style={styles.artYear}>{artYear}</Text>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.artType}>{artType}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.artDescription}>{artDescription}</Text>
      </View>
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
  },
  scrollBar: {
    // width: '100%',
    height: 80,
  },
  artTitle: {
    color: 'blue',
    fontSize: 40,
    marginTop: 10,
  },
  artistNameYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  artistName: {
    color: 'black',
    fontSize: 16,
    marginBottom: 7,
    flex: 1,
    textAlign: 'center',
  },
  artYear: {
    color: 'black',
    fontSize: 18,
    marginBottom: 7,
    flex: 1,
    textAlign: 'center',
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: 'black',
  },
  horizontalLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  artType: {
    color: 'black',
    fontSize: 18,
    marginVertical: 15,
  },
  artDescription: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  }
});

export default ImageScreen;
