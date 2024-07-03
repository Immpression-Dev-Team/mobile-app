import React from 'react';
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';

const ImageScreen = ({ route, navigation }) => {
  const { image, artistName, artTitle } = route.params;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <Image source={image} style={styles.fullImage} />
      
      <Text style={styles.artistName}>{artistName}</Text>
      <Text style={styles.artTitle}>{artTitle}</Text>
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
  artistName: {
    color: 'black',
    fontSize: 18,
    marginTop: 5,
  },
});

export default ImageScreen;
