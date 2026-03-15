import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Modal,
  StatusBar,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ExpoImage } from "expo-image";
import ScreenTemplate from "./Template/ScreenTemplate";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = Math.min(360, Math.max(260, height * 0.45));
const enlargeIcon = require("../assets/icons/enlarge.png");

const SOURCE_LABELS = {
  met: "The Metropolitan Museum of Art",
  chicago: "Art Institute of Chicago",
};

export default function PublicDomainImageScreen({ route, navigation }) {
  const { artworks = [], initialIndex = 0 } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [enlarged, setEnlarged] = useState(false);
  const flatListRef = useRef(null);

  const active = artworks[currentIndex] || {};

  const showLeft = currentIndex > 0;
  const showRight = currentIndex < artworks.length - 1;

  const goPrev = () => {
    if (currentIndex > 0) {
      const idx = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const goNext = () => {
    if (currentIndex < artworks.length - 1) {
      const idx = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const onMomentumScrollEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  const onScrollToIndexFailed = (info) => {
    const offset = Math.max(0, info.index * (info.averageItemLength || width));
    flatListRef.current?.scrollToOffset({ offset, animated: false });
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  };

  return (
    <ScreenTemplate>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator>

          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.museumBadge}>
                <Text style={styles.museumBadgeText}>
                  {SOURCE_LABELS[active.source] || "Museum Collection"}
                </Text>
              </View>
              <Text style={styles.artistName} numberOfLines={1}>
                {active.artist || "Unknown Artist"}
              </Text>
            </View>
            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{active.year || "—"}</Text>
            </View>
          </View>

          {/* Carousel */}
          <View style={styles.carouselWrap}>
            <FlatList
              ref={flatListRef}
              data={artworks}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
              decelerationRate={Platform.OS === "ios" ? "fast" : 0.9}
              bounces={false}
              overScrollMode="never"
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollToIndexFailed={onScrollToIndexFailed}
              renderItem={({ item }) => (
                <View style={styles.imageSlide}>
                  {item.imageUrl ? (
                    <>
                      <Pressable onPress={() => setEnlarged(true)}>
                        <ExpoImage
                          source={{ uri: item.imageUrl }}
                          style={styles.image}
                          contentFit="cover"
                          transition={300}
                          cachePolicy="memory-disk"
                        />
                      </Pressable>
                      <TouchableOpacity
                        style={styles.fabEnlarge}
                        onPress={() => setEnlarged(true)}
                        activeOpacity={0.85}
                      >
                        <Image source={enlargeIcon} style={styles.fabEnlargeIcon} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={[styles.image, styles.noImagePlaceholder]}>
                      <Text style={styles.noImageText}>Image not available</Text>
                    </View>
                  )}
                </View>
              )}
            />

            {showLeft && (
              <View style={styles.swipeLeft} pointerEvents="box-none">
                <LinearGradient
                  colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.0)"]}
                  start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                  style={styles.swipeGrad} pointerEvents="none"
                />
                <TouchableOpacity style={styles.swipeTapLeft} onPress={goPrev} activeOpacity={0.85}>
                  <Text style={styles.swipeChevron}>‹</Text>
                </TouchableOpacity>
              </View>
            )}
            {showRight && (
              <View style={styles.swipeRight} pointerEvents="box-none">
                <LinearGradient
                  colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.35)"]}
                  start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                  style={styles.swipeGrad} pointerEvents="none"
                />
                <TouchableOpacity style={styles.swipeTapRight} onPress={goNext} activeOpacity={0.85}>
                  <Text style={styles.swipeChevron}>›</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Title + description */}
          <View style={styles.cardFooter}>
            <Text style={styles.artTitle}>{active.title || "Untitled"}</Text>
            {!!active.description && (
              <Text style={styles.description}>{active.description}</Text>
            )}
          </View>

          {/* Artwork details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Artwork Details</Text>

            {!!active.medium && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Medium</Text>
                <Text style={styles.detailValue}>{active.medium}</Text>
              </View>
            )}
            {!!active.dimensions && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dimensions</Text>
                <Text style={styles.detailValue}>{active.dimensions}</Text>
              </View>
            )}
            {!!active.department && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>{active.department}</Text>
              </View>
            )}
            {!!active.creditLine && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Credit</Text>
                <Text style={[styles.detailValue, styles.creditText]}>{active.creditLine}</Text>
              </View>
            )}
          </View>

          {/* View at museum */}
          {!!active.sourceUrl && (
            <TouchableOpacity
              style={styles.museumLinkCard}
              onPress={() => Linking.openURL(active.sourceUrl)}
              activeOpacity={0.85}
            >
              <Text style={styles.museumLinkText}>
                View at {SOURCE_LABELS[active.source] || "Museum"} →
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* Enlarge modal */}
        <Modal visible={enlarged} transparent animationType="fade" onRequestClose={() => setEnlarged(false)}>
          <Pressable style={styles.enlargeModal} onPress={() => setEnlarged(false)}>
            <StatusBar hidden />
            <LinearGradient colors={["rgba(0,0,0,0.7)", "transparent"]} style={styles.enlargeTopFade} pointerEvents="none" />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.enlargeBottomFade} pointerEvents="none" />
            <TouchableOpacity
              onPress={() => setEnlarged(false)}
              style={styles.enlargeCloseHit}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              activeOpacity={0.8}
            >
              <Text style={styles.enlargeCloseText}>✕</Text>
            </TouchableOpacity>
            {!!active.imageUrl && (
              <ExpoImage
                source={{ uri: active.imageUrl }}
                style={styles.enlargedImage}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            )}
          </Pressable>
        </Modal>
      </View>
    </ScreenTemplate>
  );
}

const H_PADDING = 16;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FA" },

  cardHeader: {
    marginHorizontal: H_PADDING - 4,
    marginTop: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerLeft: { flex: 1, marginRight: 10 },
  museumBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  museumBadgeText: { fontSize: 10, color: "#4338CA", fontWeight: "600", letterSpacing: 0.3 },
  artistName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  yearBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  yearText: { fontSize: 13, fontWeight: "700", color: "#374151" },

  carouselWrap: { marginHorizontal: 8, marginBottom: 8 },
  imageSlide: { width, alignItems: "center" },
  image: {
    width: width - 16,
    height: IMAGE_HEIGHT,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noImagePlaceholder: { justifyContent: "center", alignItems: "center" },
  noImageText: { color: "#9CA3AF", fontSize: 14 },
  fabEnlarge: {
    position: "absolute",
    right: 20,
    bottom: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 10,
    borderRadius: 22,
    zIndex: 20,
    elevation: 20,
  },
  fabEnlargeIcon: { width: 20, height: 20, tintColor: "#fff" },

  swipeLeft: { position: "absolute", left: 0, top: 0, bottom: 0, width: 48, justifyContent: "center", zIndex: 5, elevation: 5 },
  swipeRight: { position: "absolute", right: 0, top: 0, bottom: 0, width: 48, justifyContent: "center", alignItems: "flex-end", zIndex: 5, elevation: 5 },
  swipeGrad: { position: "absolute", top: 0, bottom: 0, width: 48 },
  swipeTapLeft: { width: 44, height: 120, justifyContent: "center", alignItems: "flex-start", paddingLeft: 6 },
  swipeTapRight: { width: 44, height: 120, justifyContent: "center", alignItems: "flex-end", paddingRight: 6 },
  swipeChevron: { fontSize: 32, color: "#fff", fontWeight: "700", marginHorizontal: 8 },

  cardFooter: {
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  artTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  description: { fontSize: 13, lineHeight: 18, color: "#374151" },

  detailsCard: {
    marginTop: 12,
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    textAlign: "center",
  },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, flexWrap: "wrap", gap: 4 },
  detailLabel: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  detailValue: { fontSize: 13, color: "#111827", fontWeight: "600", flex: 1, textAlign: "right" },
  creditText: { fontSize: 11, color: "#6B7280", fontWeight: "400", fontStyle: "italic" },

  museumLinkCard: {
    marginTop: 12,
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#1E2A3A",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  museumLinkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  enlargeModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center" },
  enlargeTopFade: { position: "absolute", top: 0, left: 0, width: "100%", height: 120 },
  enlargeBottomFade: { position: "absolute", bottom: 0, left: 0, width: "100%", height: 140 },
  enlargedImage: { width: "100%", height: "100%" },
  enlargeCloseHit: { position: "absolute", top: 50, right: 24, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.35)", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  enlargeCloseText: { color: "#fff", fontSize: 22, fontWeight: "800" },
});
