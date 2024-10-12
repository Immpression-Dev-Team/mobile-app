import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import FooterNavbar from './FooterNavbar';

const { width } = Dimensions.get('window');

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { artist, profilePic, type, galleryImages = [], initialIndex } = route.params;

  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <View style={styles.card}>
          <Text style={styles.artistName}>{item.name}</Text>
          <Text style={styles.artistType}>{item.artistType}</Text>
          <Image source={{ uri: item.profilePictureLink }} style={styles.image} />
          <Text style={styles.artistBio}>Bio: {item.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/backgrounds/navbar-bg3.png")}
        style={styles.backgroundImage}
      >
        <Navbar />
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
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
          }}
        />
        <FooterNavbar />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: 127,
    flex: 1,
  },
  card: {
    width: '95%',
    backgroundColor: 'black',
    borderRadius: 0,
    padding: 4,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '77%',
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
  artistType: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  artistBio: {
    fontSize: 15,
    marginTop: 10,
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  imageContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -20,
  },
});

export default ArtistScreen;
