import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPublicDomainFeatured, searchPublicDomainArt } from "../../../API/API";
import PublicDomainArtHeader from "./PublicDomainArtHeader";
import PublicDomainArtContent from "./PublicDomainArtContent";
import LoadingSection from "../SectionTemplate/LoadingSection";

const SEARCH_TERMS = [
  "monet", "van gogh", "rembrandt", "degas", "vermeer",
  "raphael", "caravaggio", "botticelli", "titian", "rubens",
  "goya", "turner", "constable", "cezanne", "renoir",
];

export default function PublicDomainArt() {
  const navigation = useNavigation();
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const searchIndexRef = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublicDomainFeatured();
        if (res.success) setArtworks(res.data);
      } catch (e) {
        console.error("PublicDomainArt fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchMore = async () => {
    if (isFetchingMore || searchIndexRef.current >= SEARCH_TERMS.length) return;
    setIsFetchingMore(true);
    try {
      const query = SEARCH_TERMS[searchIndexRef.current];
      const res = await searchPublicDomainArt(query, "all", 10);
      if (res.success && res.data.length > 0) {
        setArtworks((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = res.data.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newItems];
        });
      }
      searchIndexRef.current += 1;
    } catch (e) {
      console.error("PublicDomainArt fetchMore error:", e);
    } finally {
      setIsFetchingMore(false);
    }
  };

  if (isLoading) {
    return <LoadingSection loadingMsg="LOADING MASTERPIECES" size="medium" />;
  }

  const handlePress = (item) => {
    const index = artworks.findIndex((a) => a.id === item.id);
    navigation.navigate("PublicDomainImageScreen", {
      artworks,
      initialIndex: index >= 0 ? index : 0,
    });
  };

  return (
    <View style={styles.container}>
      <PublicDomainArtHeader />
      <PublicDomainArtContent
        artworks={artworks}
        onPress={handlePress}
        onScrollEnd={fetchMore}
        isFetchingMore={isFetchingMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 2,
  },
});
