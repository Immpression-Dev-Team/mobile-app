import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { useAuth } from '../../state/AuthProvider';
import { getUserImages, incrementImageViews } from '../../API/API'; // Import incrementImageViews
import { useNavigation } from '@react-navigation/native';

const ProfileGallery = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalImages, setOriginalImages] = useState([]); // To store original data for infinite scroll
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      if (token) {
        try {
          const response = await getUserImages(token);
          if (response.success) {
            setImages(response.images);
            setOriginalImages(response.images); // Save original images for infinite scrolling
          } else {
            console.error('Failed to fetch images');
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      setLoading(false);
    };

    fetchImages();
  }, [token]);

  // Function to increment view count when an image is tapped
  const handleImagePress = async (index) => {
    const selectedImage = images[index];
    if (selectedImage && selectedImage._id) {
      try {
        await incrementImageViews(selectedImage._id, token); // Increment views
        console.log(`Incremented views for image ID: ${selectedImage._id}`);
      } catch (error) {
        console.error('Error incrementing image views:', error);
      }
    }
    navigation.navigate('ImageScreen', { images, initialIndex: index }); // Navigate to ImageScreen
  };

  // Infinite scrolling: Extend images array by appending original images at the end
  const handleScrollEnd = () => {
    setImages((prevImages) => [...prevImages, ...originalImages]);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.all}>
      <ScrollView
        contentContainerStyle={styles.galleryContainer}
        ref={scrollViewRef}
        onMomentumScrollEnd={handleScrollEnd} // Trigger on scroll end
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <Pressable key={index} onPress={() => handleImagePress(index)}>
              <Image
                source={{ uri: image.imageLink }}
                style={styles.image}
              />
            </Pressable>
          ))
        ) : (
          <Text>No images found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  all: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
    bottom: -100,
  },
  galleryContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: 125,
    height: 125,
    margin: 1,
  },
});

export default ProfileGallery;
