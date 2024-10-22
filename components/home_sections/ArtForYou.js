import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DiscoverButton from '../DiscoverButton';
import { useNavigation } from '@react-navigation/native';
import { getAllImages } from '../../API/API';
import FontLoader from '../../utils/FontLoader';
import { useAuth } from '../../state/AuthProvider';

const slideLeftGif = require('../../assets/slideLeft.gif'); // Import the sliding GIF

// Utility to chunk an array into groups
const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

// Utility to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const ArtForYou = () => {
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const scrollDistance = 150;
  const [artData, setArtData] = useState([]);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [originalArtData, setOriginalArtData] = useState([]);
  const inactivityTimeoutRef = useRef(null);
  const fontsLoaded = FontLoader();
  const { token } = useAuth(); // Moved useAuth to the top level

  useEffect(() => {
    if (token) {
      fetchArtData(token); // Pass the token to the fetchArtData function
      startAutoScrollOnce();
      resetInactivityTimer();
    }

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [token]); // Add token as a dependency to ensure it re-runs when token is available

  const fetchArtData = async (token) => {
    // Add token as a parameter here
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await getAllImages(token);
      console.log(response); // Check the structure of your response

      if (response.success) {
        const shuffledData = shuffleArray(response.images); // Assuming images are in response.images
        setOriginalArtData(shuffledData);
        setArtData(shuffledData);
      } else {
        console.error('Error fetching art data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching art data:', error);
    }
  };

  const startAutoScrollOnce = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: scrollDistance,
          animated: true,
        });

        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            x: 0,
            animated: true,
          });
        }, 500);
      }
    }, 2000);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    setOverlayVisible(false);

    inactivityTimeoutRef.current = setTimeout(() => {
      setOverlayVisible(true);
      fadeInOverlay();
    }, 5000);
  };

  const fadeInOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setOverlayVisible(false);
    });
  };

  const handleUserActivity = () => {
    resetInactivityTimer();
    fadeOutOverlay();
  };

  const handleImagePress = (imageIndex) => {
    navigation.navigate('ImageScreen', {
      images: artData,
      initialIndex: imageIndex,
    });
  };

  const handleScrollEnd = () => {
    setArtData((prevData) => [...prevData, ...originalArtData]);
  };

  if (artData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSquare} />
        <View style={styles.loadingSquare} />
        <View style={styles.loadingSquare} />
        <View style={styles.loadingSquare} />
        <View style={styles.loadingSquare} />
        <View style={styles.loadingSquare} />
      </View>
    );
  }

  const imageChunks = chunkArray(artData, 2);

  return (
    <TouchableWithoutFeedback onPress={handleUserActivity}>
      <LinearGradient
        colors={['white', '#acb3bf', 'white']}
        style={styles.section}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>ART FOR YOU!</Text>
          <DiscoverButton />
        </View>
        <View style={styles.allImageContainer}>
          <ScrollView
            horizontal
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleUserActivity}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {imageChunks.map((chunk, chunkIndex) => (
              <View key={chunkIndex} style={styles.column}>
                {chunk.map((art, index) => (
                  <View key={index}>
                    <Pressable
                      onPress={() => handleImagePress(chunkIndex * 2 + index)}
                    >
                      <Image
                        source={{ uri: art.imageLink }} // Using imageLink to display the image
                        style={styles.image}
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {isOverlayVisible && (
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
              <View style={styles.card}>
                <Image source={slideLeftGif} style={styles.cardImage} />
                <Text style={styles.cardText}>Scroll</Text>
              </View>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 6,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    paddingHorizontal: 5,
  },
  headerText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'LEMON MILK Bold',
  },
  allImageContainer: {
    width: '97%',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 5,
    paddingTop: 0,
    padding: 5,
    position: 'relative',
  },
  column: {
    marginRight: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 4,
    borderRadius: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: -5,
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: 30,
    height: 30,
    marginRight: 5,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  loadingSquare: {
    width: 100,
    height: 100,
    backgroundColor: '#d3d3d3',
    margin: 5,
    borderRadius: 5,
  },
});

export default ArtForYou;
