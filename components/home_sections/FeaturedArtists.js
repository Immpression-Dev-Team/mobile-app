import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DiscoverButton from '../DiscoverButton';
import { getAllProfilePictures } from '../../API/API';
import { useAuth } from '../../state/AuthProvider';
import { styles } from '../../styles/home/FeaturedArtistsStyles';

const FeaturedArtists = () => {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // const token = useAuth().token; // Add your logic to retrieve the authentication token
        const data = await getAllProfilePictures(token);
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    };

    fetchArtists();
  }, [token]);

  const navigateToArtistScreen = (artist, profilePic, type, initialIndex) => {
    navigation.navigate('ArtistScreens', {
      artist,
      profilePic,
      type,
      galleryImages: artists,
      initialIndex,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>DISCOVER ARTISTS</Text>
        <DiscoverButton />
      </View>
      <ScrollView
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {artists.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.artistContainer}
            onPress={() =>
              navigateToArtistScreen(
                item.name,
                item.profilePictureLink,
                item.type,
                index
              )
            }
          >
            <Image
              source={{ uri: item.profilePictureLink }}
              style={styles.image}
            />
            <Text style={styles.artistName}>{item.name}</Text>
            <Text style={styles.artistType}>{item.artistType}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};


export default FeaturedArtists;
