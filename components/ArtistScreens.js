import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { incrementViews } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import ScreenTemplate from '../screens/Template/ScreenTemplate';

const { width } = Dimensions.get('window');

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { artist, profilePic, type, galleryImages = [], initialIndex } = route.params;
  const { userData, token } = useAuth();
  const flatListRef = useRef(null);

  const handleViewIncrement = async (index) => {
    const currentArtist = galleryImages[index];
    if (currentArtist && currentArtist._id) {
      try {
        await incrementViews(currentArtist._id, token);
        console.log(`Incremented views for artist: ${currentArtist.name}`);
      } catch (error) {
        console.error('Error incrementing artist views:', error);
      }
    }
  };

  const handleViewProfile = (item) => {
    const isOwnProfile = item._id === userData._id;
    navigation.navigate('Profile', { userId: item._id, isOwnProfile });
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Profile', { userId: item._id }) // <-- send artist's userId
        }
        style={{ position: 'absolute', top: 15, right: 15, padding: 8, backgroundColor: '#fff', borderRadius: 5, zIndex: 10 }}
      >
        <Text style={{ fontWeight: 'bold' }}>View Profile</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistType}>{item.artistType}</Text>
        <Image source={{ uri: item.profilePictureLink }} style={styles.image} />
        <Text style={styles.artistBio}>Bio: {item.bio}</Text>
      </View>
    </View>
  );

  return (
    <ScreenTemplate>
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
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          handleViewIncrement(index);
        }}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
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
  viewProfileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  viewProfileText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ArtistScreen;