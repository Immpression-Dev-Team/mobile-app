import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getUserImages, fetchLikedImages, incrementImageViews } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from '../screens/Template/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const GalleryView = ({ route }) => {
  const { type } = route.params;
  const { userData } = useAuth();
  const token = userData?.token;
  const [images, setImages] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      if (!token) return;

      try {
        if (type === 'liked') {
          const likedImgsRes = await fetchLikedImages(token);
          setImages(likedImgsRes?.images || []);
        } else if (type === 'selling') {
          const res = await getUserImages(token);
          setImages(res.images.filter((img) => img.stage === 'approved'));
        } else if (type === 'sold') {
          const res = await getUserImages(token);
          setImages(res.images.filter((img) => img.stage === 'sold'));
        } else if (type === 'bought') {
          setImages([]);
        }
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      }
    };

    fetchImages();
  }, [type, token]);

  const handleImagePress = async (image, index) => {
    try {
      await incrementImageViews(image._id, token);
    } catch (err) {
      console.error('Error incrementing image views:', err);
    } finally {
      navigation.navigate('ImageScreen', {
        images,
        initialIndex: index,
      });
    }
  };

  const titleMap = {
    liked: 'Favorited',
    selling: 'Gallery / Selling',
    sold: 'Sold',
    bought: 'Bought',
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{titleMap[type]}</Text>
        {images.length === 0 ? (
          <Text style={styles.emptyText}>No artwork found in this folder.</Text>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.gallery}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleImagePress(item, index)} style={styles.imageWrapper}>
                <Image source={{ uri: item.imageLink }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 5,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  gallery: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  imageWrapper: {
    width: screenWidth / 2 - 20,
    height: 200,
    margin: 10,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});

export default GalleryView;
