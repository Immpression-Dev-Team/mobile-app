import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../../../state/AuthProvider";
import FontLoader from "../../../utils/FontLoader";

import ArtForYouHeader from "./ArtForYouHeader";
import ArtForYouContent from "./ArtForYouContent";
import LoadingSection from "../SectionTemplate/LoadingSection";
import { getAllImages, incrementImageViews } from "../../../API/API"; // Import incrementImageViews


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

  const [artData, setArtData] = useState([]);
  const [originalArtData, setOriginalArtData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

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
      const response = await getAllImages(token);
      if(!response.success){
        console.error("Error fetching art data:", response.message);
        return;
      }

      const shuffledData = shuffleArray(response.images);
      setOriginalArtData(shuffledData);
      setArtData(shuffledData);

    } catch (error) {
      console.error("Error fetching art data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image press and increment views
  const handleImagePress = async (imageIndex) => {
    const selectedImage = artData[imageIndex];
  
    if (selectedImage && selectedImage._id) {
      try {
        // Increment view count for the image and get updated views
        const updatedImage = await incrementImageViews(selectedImage._id, token);
        
        if (updatedImage.success) {
          const updatedViewCount = updatedImage.views; // Get new views from response
          console.log(`Updated views for image ID: ${selectedImage._id}: ${updatedViewCount}`);
          
          // Navigate to ImageScreen with updated view count
          navigation.navigate("ImageScreen", {
            images: artData,
            initialIndex: imageIndex,
            views: updatedViewCount,
          });
        }
      } catch (error) {
        console.error("Error incrementing image views:", error);
      }
    }
  };

  const handleScrollEnd = () => {
    setArtData((prevData) => [...prevData, ...originalArtData]);
  };

  // fetch art & auto scroll when land page
  useEffect(() => {
    if (token) {
      fetchArtData(token);
      startAutoScrollOnce();
      resetInactivityTimer();
    }

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [token]);

  // render animation if still loading images
  if (isLoading) {
    return(
      <LoadingSection
        loadingMsg={'LOADING ART FOR YOU!'}
        size={'large'}
      />
    );
  }

  const imageChunks = chunkArray(artData, 2);

  return (
    <TouchableWithoutFeedback onPress={handleUserActivity}>
      <LinearGradient
        colors={["white", "#acb3bf", "white"]}
        style={styles.container}
      >
        <ArtForYouHeader/>
        <ArtForYouContent
          fadeAnim={fadeAnim}
          imageChunks={imageChunks}
          scrollViewRef={scrollViewRef}
          isOverlayVisible={isOverlayVisible}
          handleScrollEnd={handleScrollEnd}
          handleImagePress={handleImagePress}
          handleUserActivity={handleUserActivity}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    padding: '1.75%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingGif: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});