import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Animated, TouchableWithoutFeedback, View, Image, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../../../state/AuthProvider';
import FontLoader from '../../../utils/FontLoader';

import ArtForYouHeader from './ArtForYouHeader';
import ArtForYouContent from './ArtForYouContent';
import LoadingSection from '../SectionTemplate/LoadingSection';
import { getAllImages, incrementImageViews } from '../../../API/API';

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

export default function ArtForYou() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const fontsLoaded = FontLoader();

  const scrollViewRef = useRef(null);
  const scrollDistance = 150;
  const inactivityTimeoutRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const paintFadeAnim = useRef(new Animated.Value(0)).current;

  const [artData, setArtData] = useState([]);
  const [page, setPage] = useState(1);
  const [originalArtData, setOriginalArtData] = useState([]);
  const [hasMore, setHasMore] = useState(true); // track if more data is available

  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isGuest, setIsGuest] = useState(false); // track if user is guest with no data

  // auto scroll once when landing on pages
  const startAutoScrollOnce = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef?.current?.scrollTo({
          x: scrollDistance,
          animated: true,
        });

        setTimeout(() => {
          scrollViewRef?.current?.scrollTo({
            x: 0,
            animated: true,
          });
        }, 500);
      }
    }, 2000);
  };

  // fade in/out animation
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

  // resets inactivity timer & shows overlay after 5s
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

  // resets inactivity timer & hide overlay when moving
  const handleUserActivity = () => {
    resetInactivityTimer();
    fadeOutOverlay();
  };

  const fetchArtData = async (token) => {
    try {
      const response = await getAllImages(token, 1, 50); // Always start from page 1

      // Check if response indicates auth error (guest user)
      if (!response.success && response.error === "Authorization header missing or invalid") {
        console.log('Guest user detected - showing limited content');
        setIsGuest(true);
        setIsLoading(false);
        return;
      }

      if (!response.success) {
        console.error('Error fetching art data:', response.data);
        setIsGuest(true);
        return;
      }
      console.log('Fetched images length =', response.images.length);

      // Filter out only approved artworks
      const approvedArt = response.images.filter(
        (image) => image.stage === 'approved',
      );
      console.log('Approved images length =', approvedArt.length);

      const shuffledData = shuffleArray(approvedArt);
      setOriginalArtData(shuffledData);
      setPage(1); // Reset to page 1

      // Only has more if we got a full page (50 items)
      setHasMore(response.images.length === 50);
    } catch (error) {
      console.error('Error fetching art data:', error);
      setIsGuest(true);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreArtData = async (token) => {
    if (isLoading) return; // Prevent multiple concurrent requests

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await getAllImages(token, nextPage, 50);

      if (!response.success) {
        console.error('Error fetching more art data:', response.data);
        return;
      }

      console.log('Fetched images length =', response.images.length);

      if (response.images.length === 0) {
        setHasMore(false);
        return;
      }

      // Filter out only approved artworks
      const approvedArt = response.images.filter(
        (image) => image.stage === 'approved',
      );
      console.log('Approved images length =', approvedArt.length);

      if (approvedArt.length === 0) {
        // If no approved art in this batch, try next page
        setPage(nextPage);
        setHasMore(response.images.length === 50); // Only has more if we got full page
        return;
      }

      const shuffledData = shuffleArray(approvedArt);
      setOriginalArtData((prevData) => [...prevData, ...shuffledData]);
      setPage(nextPage);

      // Only set hasMore to true if we got a full page (50 items)
      setHasMore(response.images.length === 50);
    } catch (error) {
      console.error('Error fetching more art data:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePress = async (imageIndex) => {
    const selectedImage = originalArtData[imageIndex];

    if (selectedImage && selectedImage._id) {
      let updatedViewCount = selectedImage.views; // Default to existing count

      // Only increment views if user is authenticated
      if (token) {
        try {
          const updatedImage = await incrementImageViews(
            selectedImage._id,
            token
          );
          if (updatedImage.success) {
            updatedViewCount = updatedImage.views;
          }
        } catch (error) {
          console.error('Error incrementing image views:', error);
        }
      }

      // Navigate even if update fails or user is guest
      navigation.navigate('ImageScreen', {
        images: originalArtData,
        initialIndex: imageIndex,
        views: updatedViewCount,
      });
    }
  };

  const handleScrollEnd = async () => {
    if (hasMore && !isLoading) {
      await fetchMoreArtData(token);
    }
  };

  const handleRefresh = async () => {
    if (!isLoading) {
      setIsLoading(true);
      await fetchArtData(token);
    }
  };

  // fetch art & auto scroll when land page
  useEffect(() => {
    let isMounted = true;

    // Fetch data regardless of token (works for both guests and authenticated users)
    fetchArtData(token);
    startAutoScrollOnce();
    resetInactivityTimer();

    // Animate paint fade-in
    setTimeout(() => {
      Animated.timing(paintFadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, 500);

    return () => {
      isMounted = false;
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [paintFadeAnim]);

  // render animation if still loading images
  if (isLoading) {
    return <LoadingSection loadingMsg="LOADING ART FOR YOU!" size="large" />;
  }

  // Show guest message if user is not authenticated
  if (isGuest) {
    return (
      <View style={styles.container}>
        <ArtForYouHeader />
        <View style={styles.guestContainer}>
          <Text style={styles.guestEmoji}>🎨</Text>
          <Text style={styles.guestTitle}>Sign Up to Discover Personalized Art</Text>
          <Text style={styles.guestSubtitle}>
            Create an account to see artwork curated just for you
          </Text>
          <Pressable
            style={styles.guestButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.guestButtonText}>Sign Up or Log In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const imageChunks = chunkArray(originalArtData, 2);

  return (
    <TouchableWithoutFeedback onPress={handleUserActivity}>
      <View style={styles.container}>
        <ArtForYouHeader />
        <View style={styles.contentWrapper}>
          {/* Paint behind pictures to the right */}
          {/* <Animated.Image
            source={require('../../../assets/orange-paint2.png')}
            style={[styles.paintBehindPictures, { opacity: paintFadeAnim }]}
            resizeMode="contain"
          /> */}
          <ArtForYouContent
            fadeAnim={fadeAnim}
            imageChunks={imageChunks}
            scrollViewRef={scrollViewRef}
            isOverlayVisible={isOverlayVisible}
            handleScrollEnd={handleScrollEnd}
            handleImagePress={handleImagePress}
            handleUserActivity={handleUserActivity}
            handleRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    padding: 16,
    paddingTop: 0,
    paddingBottom: 4,
    marginTop: 0,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  paintBehindPictures: {
    position: 'absolute',
    top: -70,
    right: -400,
    width: 550,
    height: 550,
    transform: [{ rotate: '180deg' }],
    opacity: 0.7,
    zIndex: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingGif: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginTop: 16,
  },
  guestEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  guestButton: {
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
