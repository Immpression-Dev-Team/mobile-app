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
import { getLimitedImages, incrementImageViews } from "../../../API/API";

const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const shuffleArray = (array) => {
  let shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get a random index
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
}

export default function ArtForYou() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const fontsLoaded = FontLoader();

  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [artData, setArtData] = useState([]); // Displayed images
  const [storedArtData, setStoredArtData] = useState([]); // Stored images
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMoreImages, setHasMoreImages] = useState(true); // Check if there are more images

  const fetchArtData = async (pageNumber) => {
    // 9/10 we probably dont need the limit parameter
    try {
      const response = await getLimitedImages(token, 20, pageNumber); // Fetch 52 images for the given page
      if (!response.success) {
        console.error("Error fetching art data:", response.message);
        return;
      }
      // console.log(response.images)
      const images = shuffleArray(response.images);
      
      console.log(images)
      


      if (images.length === 0) {
        setHasMoreImages(false); // No more images to load
        return;
      }

      const displayedImages = images.slice(0, 26); // First 25 images
      const storedImages = images.slice(26); // Next 25 images

      if (pageNumber === 1) {
        // Initial load
        setArtData(displayedImages);
        setStoredArtData(storedImages);
      } else {
        // Append new images
        setArtData((prev) => [...prev, ...displayedImages]);
        setStoredArtData(storedImages);
      }
      // console.log(displayedImages)
    } catch (error) {
      console.error("Error fetching art data:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleImagePress = async (imageIndex) => {
    const selectedImage = artData[imageIndex];

    if (selectedImage && selectedImage._id) {
      try {
        const updatedImage = await incrementImageViews(selectedImage._id, token);
        if (updatedImage.success) {
          const updatedViewCount = updatedImage.views;
          console.log(
            `Updated views for image ID: ${selectedImage._id}: ${updatedViewCount}`
          );

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
    if (!isFetchingMore && storedArtData.length > 0) {
      // Lazy load the stored images
      setArtData((prev) => [...prev, ...storedArtData]);
      setStoredArtData([]);
    } else if (!isFetchingMore && hasMoreImages) {
      // Fetch next page of images if no stored images are available
      setIsFetchingMore(true);
      setPage((prev) => prev + 1); // Increment the page number
    }
  };

  useEffect(() => {
    if (token) {
      fetchArtData(1); // Fetch the first page of images initially
    }
  }, [token]);

  useEffect(() => {
    if (page > 1) {
      fetchArtData(page); // Fetch new page of images on page change
    }
  }, [page]);

  if (isLoading) {
    return (
      <LoadingSection loadingMsg="LOADING ART FOR YOU!" size="large" />
    );
  }

  const imageChunks = chunkArray(artData, 2); // Group images into chunks for display

  return (
    <TouchableWithoutFeedback>
      <LinearGradient
        colors={["white", "#acb3bf", "white"]}
        style={styles.container}
      >
        <ArtForYouHeader />
        <ArtForYouContent
          fadeAnim={fadeAnim}
          imageChunks={imageChunks}
          scrollViewRef={scrollViewRef}
          isOverlayVisible={isFetchingMore}
          handleScrollEnd={handleScrollEnd}
          handleImagePress={handleImagePress}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    padding: "1.75%",
  },
});
