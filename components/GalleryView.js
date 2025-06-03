import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {
  getUserImages,
  fetchLikedImages,
  incrementImageViews,
} from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from '../screens/Template/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const filterTypes = [
  { label: 'Selling', value: 'selling' },
  { label: 'Sold', value: 'sold' },
  { label: 'Bought', value: 'bought' },
  { label: 'Liked', value: 'liked' },
];

const GalleryView = ({ route }) => {
  const initialType = route.params.type;
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [activeType, setActiveType] = useState(initialType);

  useEffect(() => {
    const fetchImages = async () => {
      if (!token) return;

      try {
        if (activeType === 'liked') {
          const likedImgsRes = await fetchLikedImages(token);
          setImages(likedImgsRes?.images || []);
        } else {
          const res = await getUserImages(token);

          setImages(
            res.images.filter((img) => {
              if (activeType === 'selling') return img.stage === 'approved';
              if (activeType === 'sold') return img.stage === 'sold';
              if (activeType === 'bought') return false; // Update later when logic exists
            })
          );
        }
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      }
    };

    fetchImages();
  }, [activeType, token]);

  const handleImagePress = async (image, index) => {
    try {
      await incrementImageViews(image._id, token);
    } catch (err) {
      console.error('Error incrementing image views:', err);
    } finally {
      const normalizedImages = images.map((img) => ({
        ...img,
        artist: {
          name: img?.artist?.name || img?.artistName || 'Unknown Artist',
        },
      }));

      navigation.navigate('ImageScreen', {
        images: normalizedImages,
        initialIndex: index,
      });
    }
  };

  const RenderItem = ({ item, index }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleImagePress(item, index)}
      >
        <Animated.View
          style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <Image
            source={{ uri: item.imageLink }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardInfo}>
            <Text style={styles.artTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.artArtist} numberOfLines={1}>
              {item.artistName || 'Unknown Artist'}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>
              {filterTypes.find((f) => f.value === activeType).label}
            </Text>
            <Text style={styles.count}>{images.length} images</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filterTypes.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                activeType === filter.value && styles.filterButtonActive,
              ]}
              onPress={() => setActiveType(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeType === filter.value && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {images.length === 0 ? (
          <Text style={styles.emptyText}>No artwork found in this folder.</Text>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.gallery}
            renderItem={RenderItem}
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 1,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  count: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch', // Stretch horizontally
    marginTop: 15,
    marginHorizontal: 12,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#f1f3f5',
  },

  filterButton: {
    flex: 1, // Make buttons evenly stretch across the container
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  filterButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },

  filterText: {
    color: '#333',
    fontSize: 13,
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  gallery: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  imageWrapper: {
    width: screenWidth / 2 - 20,
    height: 200,
    marginHorizontal: 3,
    marginTop: 5,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  cardContainer: {
    width: screenWidth / 2 - 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  cardInfo: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  artTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  artArtist: {
    fontSize: 12,
    color: '#777',
  },
});

export default GalleryView;
