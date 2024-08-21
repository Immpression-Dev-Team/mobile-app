import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';

const { width } = Dimensions.get('window');

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { artist, profilePic, galleryImages = [], initialIndex } = route.params;

  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <View style={styles.card}>
          <Text style={styles.artistName}>{item.artist}</Text>
          <Image source={item.profilePic} style={styles.image} />
          <Text style={styles.artistName}>{item.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={galleryImages}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
        initialScrollIndex={initialIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
  },
  card: {
    width: '90%',
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 2,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 100, // Ensure there's space between the card and the next item
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 0,
    marginTop: 10,
  },
  artistName: {
    fontSize: 24,
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  imageContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -20, // Adjust this to bring the card higher up
  },
});

export default ArtistScreen;
