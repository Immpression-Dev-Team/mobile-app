import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";

export default function PublicDomainArtContent({ artworks = [], onPress, onScrollEnd, isFetchingMore }) {
  const triggered = useRef(false);

  if (!artworks.length) {
    return <Text style={styles.empty}>No artworks available.</Text>;
  }

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const nearEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 200;
    if (nearEnd && !triggered.current) {
      triggered.current = true;
      onScrollEnd?.();
    }
  };

  const handleScrollBeginDrag = () => {
    triggered.current = false;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      scrollEventThrottle={100}
    >
      {artworks.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => onPress?.(item)}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: item.thumbnailUrl || item.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      ))}
      {isFetchingMore && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      )}
    </ScrollView>
  );
}

const CARD_W = Platform.OS === "web" ? 140 : 82;
const IMG_H = Platform.OS === "web" ? 120 : 68;

const styles = StyleSheet.create({
  scrollView: {
    height: Platform.OS === "web" ? 140 : 80,
  },
  card: {
    width: CARD_W,
    marginRight: 10,
    alignItems: "center",
  },
  image: {
    width: CARD_W,
    height: IMG_H,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  info: {
    width: "100%",
    paddingTop: 5,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 1,
  },
  artist: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "500",
  },
  year: {
    fontSize: 9,
    color: "#9CA3AF",
  },
  loader: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
});
