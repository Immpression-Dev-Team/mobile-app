import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { useAuth } from '../../state/AuthProvider';  // Import the useAuth hook
import { getUserImages } from '../../API/API';  // Import the function to fetch user images
import { useNavigation } from '@react-navigation/native';  // Import navigation

const ProfileGallery = () => {
  const { userData } = useAuth();  // Use the useAuth hook to get the user data
  const token = userData?.token;   // Extract the token from userData
  const [images, setImages] = useState([]);  // Initialize state to hold the images
  const [loading, setLoading] = useState(true);  // Loading state
  const navigation = useNavigation();  // Access the navigation object

  useEffect(() => {
    const fetchImages = async () => {
      if (token) {
        try {
          const response = await getUserImages(token);  // Fetch the images
          if (response.success) {
            setImages(response.images);  // Set the images in state
          } else {
            console.error('Failed to fetch images');
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      setLoading(false);  // Stop loading after the fetch
    };

    fetchImages();
  }, [token]);

  const handleImagePress = (index) => {
    navigation.navigate('ImageScreen', { images, initialIndex: index });  // Navigate to the ImageScreen
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.all}>
      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <Pressable key={index} onPress={() => handleImagePress(index)}>
              <Image
                source={{ uri: image.imageLink }}  // Assuming imageLink holds the URL of the image
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
