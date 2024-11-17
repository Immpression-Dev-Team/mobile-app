import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
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

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getAllProfilePictures(token);
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [token]);

  const navigateToArtistScreen = async (artist, profilePic, type, initialIndex, userId) => {
    try {
      await incrementViews(userId, token); // Increment views for the specific user
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
    return(
      <LoadingSection
        loadingMsg={'LOADING DISCOVER ARTISTS'}
        size={'medium'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FeaturedArtistsHeader/>
      <FeaturedArtistsContent
        artists={artists}
        navigate={navigateToArtistScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: (Platform.OS === 'web') ? '1%' : '1.75%',
  },
});