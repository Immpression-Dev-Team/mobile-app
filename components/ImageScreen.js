import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ImageScreen = ({ route, navigation }) => {
  const { image, artistName } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Image source={image} style={styles.fullImage} />
      <Text style={styles.artistName}>{artistName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
  },
  fullImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  artistName: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});

export default ImageScreen;
