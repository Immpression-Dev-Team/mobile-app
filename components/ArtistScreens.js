// ArtistScreen.jsx — horizontal swipe between artists, scrollable page, no enlarge
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import ScreenTemplate from "../screens/Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import { incrementProfileViews } from "../API/API";

const H_PADDING = 16;
const AVATAR_SIZE = 46;

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    galleryImages = [], // [{ _id, name, artistType, profilePictureLink, bio, views }]
    initialIndex = 0,
  } = route.params || {};

  const { userData, token } = useAuth();
  const { width, height } = useWindowDimensions();
  const BANNER_HEIGHT = Math.min(420, Math.max(260, height * 0.45));

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const listRef = useRef(null);

  // increment views on page change
  useEffect(() => {
    if (!galleryImages.length || !token) return;
    const artist = galleryImages[currentIndex];
    if (!artist?._id) return;
    (async () => {
      try { await incrementProfileViews(artist._id, token); } catch {}
    })();
  }, [currentIndex, token, galleryImages]);

  const goPrev = () => {
    if (currentIndex > 0 && listRef.current) {
      const idx = currentIndex - 1;
      listRef.current.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const goNext = () => {
    if (currentIndex < galleryImages.length - 1 && listRef.current) {
      const idx = currentIndex + 1;
      listRef.current.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const onMomentumScrollEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  const onScrollToIndexFailed = (info) => {
    const offset = Math.max(0, info.index * (info.averageItemLength || width));
    listRef.current?.scrollToOffset({ offset, animated: false });
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  };

  const renderPage = ({ item: artist, index }) => {
    const isOwnProfile = artist?._id && userData?._id && artist._id === userData._id;

    return (
      <View style={{ width }}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.scrollGrow}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          {/* Header Card */}
          <View style={styles.cardHeader}>
            <View style={styles.artistLeft}>
              {!!artist?.profilePictureLink ? (
                <Image source={{ uri: artist.profilePictureLink }} style={styles.artistAvatar} />
              ) : (
                <View style={[styles.artistAvatar, styles.avatarFallback]}>
                  <Text style={styles.avatarFallbackText}>
                    {artist?.name?.[0]?.toUpperCase() || "A"}
                  </Text>
                </View>
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.artistName}>{artist?.name || "Unknown Artist"}</Text>
                {!!artist?.artistType && (
                  <Text style={styles.artistCategory}>{artist.artistType}</Text>
                )}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>👁</Text>
                <Text style={styles.statText}>{artist?.views ?? 0}</Text>
              </View>
            </View>
          </View>

          {/* Banner / Portrait */}
          <View style={[styles.bannerWrap, { width }]}>
            <View style={[styles.bannerSlide, { width }]}>
              {artist?.profilePictureLink ? (
                <Image
                  source={{ uri: artist.profilePictureLink }}
                  style={[
                    styles.bannerImage,
                    { width: width - 16, height: BANNER_HEIGHT },
                  ]}
                />
              ) : (
                <Text style={{ color: "#c00" }}>No profile image available</Text>
              )}
            </View>

            {/* Swipe chevrons */}
            {index > 0 && (
              <View style={styles.swipeLeft} pointerEvents="box-none">
                <LinearGradient
                  colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.0)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.swipeGrad}
                  pointerEvents="none"
                />
                <TouchableOpacity
                  style={styles.swipeTapLeft}
                  onPress={goPrev}
                  activeOpacity={0.85}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.swipeChevron}>‹</Text>
                </TouchableOpacity>
              </View>
            )}

            {index < galleryImages.length - 1 && (
              <View style={styles.swipeRight} pointerEvents="box-none">
                <LinearGradient
                  colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.35)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.swipeGrad}
                  pointerEvents="none"
                />
                <TouchableOpacity
                  style={styles.swipeTapRight}
                  onPress={goNext}
                  activeOpacity={0.85}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.swipeChevron}>›</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bio + CTA */}
          <View style={styles.cardFooter}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description} numberOfLines={10} ellipsizeMode="tail">
                {artist?.bio?.trim() || "No bio provided."}
              </Text>
            </View>

            <View style={styles.sideActions}>
              <TouchableOpacity
                style={styles.primaryPill}
                onPress={() =>
                  navigation.navigate("Profile", { userId: artist?._id, isOwnProfile })
                }
                activeOpacity={0.9}
              >
                <Text style={styles.pillText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScreenTemplate>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={listRef}
        data={galleryImages}
        keyExtractor={(it, idx) => it?._id || String(idx)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex || 0}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={renderPage}
        // eliminates extra gap on some devices
        contentContainerStyle={{ minHeight: height }}
        style={{ flex: 1 }}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FA" },
  scrollGrow: { flexGrow: 1 },

  // Header
  cardHeader: {
    marginHorizontal: H_PADDING - 4,
    marginTop: 8,
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
  artistLeft: { flexDirection: "row", alignItems: "center" },
  artistAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  avatarFallback: { justifyContent: "center", alignItems: "center" },
  avatarFallbackText: { fontWeight: "800", color: "#111827" },
  artistName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  artistCategory: {
    marginTop: 4,
    alignSelf: "flex-start",
    fontSize: 11,
    color: "#4F46E5",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    letterSpacing: 0.3,
  },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statEmoji: { marginRight: 6 },
  statText: { fontSize: 12, fontWeight: "700", color: "#111827" },

  // Banner
  bannerWrap: { marginHorizontal: 8, marginBottom: 8, position: "relative" },
  bannerSlide: { alignItems: "center" },
  bannerImage: {
    borderRadius: 14,
    resizeMode: "cover",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    alignSelf: "center",
  },

  // Swipe chevrons
  swipeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 48,
    justifyContent: "center",
    zIndex: 5,
    elevation: 5,
  },
  swipeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 5,
    elevation: 5,
  },
  swipeGrad: { position: "absolute", top: 0, bottom: 0, width: 48 },
  swipeTapLeft: {
    width: 44,
    height: 120,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 6,
  },
  swipeTapRight: {
    width: 44,
    height: 120,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 6,
  },
  swipeChevron: { fontSize: 32, color: "#fff", fontWeight: "700", marginHorizontal: 8 },

  // Bio + CTA
  cardFooter: {
    marginTop: 6,
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  description: { fontSize: 13, lineHeight: 18, color: "#374151" },
  sideActions: { alignItems: "center" },
  primaryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});

export default ArtistScreen;
