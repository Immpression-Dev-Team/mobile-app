import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Animated,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../state/AuthProvider";

import { getAllProfilePictures, incrementViews } from "../../../API/API";
import FeaturedArtistsHeader from "./FeaturedArtistsHeader";
import FeaturedArtistsContent from "./FeaturedArtistsContent";
import LoadingSection from "../SectionTemplate/LoadingSection";

export default function FeaturedArtists() {
  const { token } = useAuth();
  const navigation = useNavigation();

  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const paintContainerFadeAnim = useRef(new Animated.Value(0)).current;
  const paintCardFadeAnim = useRef(new Animated.Value(0)).current;
  const paintArtFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        console.log("Fetching artists from API...");
        const data = await getAllProfilePictures(token);

        console.log("Artists API Response:", data);

        if (!Array.isArray(data)) {
          console.error("Error: `artists` is not an array!", data);
          setArtists([]);
          return;
        }

        setArtists(data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
    
    // Animate paint layers sequentially
    setTimeout(() => {
      Animated.timing(paintContainerFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 300);
    
    setTimeout(() => {
      Animated.timing(paintCardFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 800);
    
    setTimeout(() => {
      Animated.timing(paintArtFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1300);
  }, [token, paintContainerFadeAnim, paintCardFadeAnim, paintArtFadeAnim]);

  const navigateToArtistScreen = async (artist, profilePic, type, initialIndex, userId) => {
    try {
      // Only increment views if user is authenticated
      if (token) {
        await incrementViews(userId, token);
      }
      navigation.navigate("ArtistScreens", {
        artist,
        profilePic,
        type,
        galleryImages: artists,
        initialIndex,
      });
      console.log(`Navigating to ${artist}'s screen`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  if (isLoading) {
    return (
        <LoadingSection
            loadingMsg="LOADING DISCOVER ARTISTS"
            size="medium"
        />
    );
  }

  return (
    <View style={styles.outerWrapper}>
      {/* Paint behind entire container */}
      {/* <Animated.Image
        source={require('../../../assets/red-paint2.png')}
        style={[styles.paintBehindEntireContainer, { opacity: paintContainerFadeAnim }]}
        resizeMode="contain"
      /> */}
      {/* Paint behind entire card */}
      <Animated.Image
        source={require('../../../assets/red-paint.png')}
        style={[styles.paintBehindCard, { opacity: paintCardFadeAnim }]}
        resizeMode="contain"
      />
      <View style={styles.cardWrapper}>
        {/* Paint behind header only */}
        <Animated.Image
          source={require('../../../assets/red-paint.png')}
          style={[styles.paintBehindHeader, { opacity: paintCardFadeAnim }]}
          resizeMode="contain"
        />
        <View style={styles.container}>
          <FeaturedArtistsHeader />
          <View style={styles.contentWrapper}>
            {/* Paint behind art on card */}
            {/* <Animated.Image
              source={require('../../../assets/red-paint2.png')}
              style={[styles.paintBehindArtOnCard, { opacity: paintArtFadeAnim }]}
              resizeMode="contain"
            /> */}
            <FeaturedArtistsContent
                artists={artists}
                navigate={navigateToArtistScreen}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  paintBehindEntireContainer: {
    position: 'absolute',
    top: -40,
    right: -280,
    width: 200,
    height: 200,
    transform: [{ rotate: '0deg' }],
    opacity: 1,
    zIndex: 1,
  },
  paintBehindCard: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 550,
    height: 150,
    transform: [{ rotate: '2deg' }, { scaleX: 1.2 }],
    opacity: 0.8,
    zIndex: 0,
  },
  paintBehindHeader: {
    position: 'absolute',
    top: -30,
    left: -50,
    width: 230,
    height: 50,
    transform: [{ rotate: '-1deg' }],
    opacity: 0.6,
    zIndex: -1,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.36,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 12,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  paintBehindArtOnCard: {
    position: 'absolute',
    top: 60,
    right: -50,
    width: 150,
    height: 150,
    transform: [{ rotate: '0deg' }],
    opacity: 0,
    zIndex: -1,
  },
});
