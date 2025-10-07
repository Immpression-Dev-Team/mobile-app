import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Modal,
  StatusBar,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScreenTemplate from "../screens/Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import {
  toggleLike,
  fetchLikeData,
  incrementImageViews,
  fetchUserProfilePicture,
} from "../API/API";

const like = require("../assets/icons/like-button.jpg");
const likedIcon = require("../assets/icons/like-button.jpg");
const cartIcon = require("../assets/icons/shopping-cart.png");
const enlargeIcon = require("../assets/icons/enlarge.png");

const { width, height } = Dimensions.get("window");
const H_PADDING = 16;
const IMAGE_HEIGHT = Math.min(360, Math.max(260, height * 0.45));

/** Normalize any incoming shape (liked, selling, order-mapped, etc.) into a consistent object */
const resolveItem = (raw = {}) => {
  const nest = raw.image || raw.imageDoc || {};
  const imageLink = raw.imageLink || nest.imageLink || raw.uri;

  const name =
    raw.name ||
    raw.title ||
    nest.name ||
    nest.title ||
    "Untitled";

  const artistName =
    raw.artistName ||
    raw?.artist?.name ||
    nest.artistName ||
    nest?.artist?.name ||
    raw.sellerName ||
    raw?.user?.name ||
    "Unknown Artist";

  const price =
    typeof raw.price === "number"
      ? raw.price
      : typeof nest.price === "number"
      ? nest.price
      : undefined;

  const category = raw.category || nest.category;
  const views =
    typeof raw.views === "number"
      ? raw.views
      : typeof nest.views === "number"
      ? nest.views
      : 0;

  const userId = raw.userId || nest.userId || raw?.user?._id;

  const dimensions = raw.dimensions || nest.dimensions || null;
  const weight =
    typeof raw.weight === "number"
      ? raw.weight
      : typeof nest.weight === "number"
      ? nest.weight
      : undefined;

  const soldStatus = raw.soldStatus || nest.soldStatus;
  const stage = raw.stage || nest.stage;
  const isSold =
    !!raw.isSold ||
    String(soldStatus || "").toLowerCase() === "sold" ||
    stage === "sold";

  const id = raw._id || nest._id;

  return {
    _id: id,
    imageLink,
    name,
    artistName,
    price,
    category,
    views,
    userId,
    dimensions,
    weight,
    isSold,
    likes: raw.likes, // keep if present
  };
};

const ImageScreen = ({ route, navigation }) => {
  const { images = [], initialIndex = 0 } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [enlarged, setEnlarged] = useState(false);

  const scrollRef = useRef(null);
  const flatListRef = useRef(null);

  const { token } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const scrollHintOpacity = useRef(new Animated.Value(1)).current;
  const [shownScrollHint, setShownScrollHint] = useState(true);

  // Resolve the currently visible item into a consistent shape
  const active = resolveItem(images[currentIndex] || {});

  useEffect(() => {
    if (!active.userId || !token) return;
    fetchUserProfilePicture(active.userId, token)
      .then(setProfilePicture)
      .catch(() => setProfilePicture(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.userId, token, currentIndex]);

  useEffect(() => {
    if (!active._id || !token) return;
    (async () => {
      await handleFetchLikeData(active._id);
      await handleViewIncrement(currentIndex);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active._id, token, currentIndex]);

  const handleFetchLikeData = async (imageId) => {
    try {
      const data = await fetchLikeData(imageId, token);
      setLikes(Number(data?.likesCount || 0));
      setHasLiked(!!data?.hasLiked);
    } catch {}
  };

  const handleToggleLike = async () => {
    try {
      if (!active._id) return;
      const data = await toggleLike(active._id, token);
      setLikes(Number(data?.likesCount || 0));
      setHasLiked(!!data?.hasLiked);
    } catch {}
  };

  const handleViewIncrement = async (index) => {
    const target = resolveItem(images[index] || {});
    if (!target._id || !token) return;
    try {
      await incrementImageViews(target._id, token);
    } catch {}
  };

  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  const onScrollToIndexFailed = (info) => {
    const offset = Math.max(0, info.index * (info.averageItemLength || width));
    flatListRef.current?.scrollToOffset({ offset, animated: false });
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 50);
  };

  const goPrev = () => {
    if (currentIndex > 0 && flatListRef.current) {
      const idx = currentIndex - 1;
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const goNext = () => {
    if (currentIndex < images.length - 1 && flatListRef.current) {
      const idx = currentIndex + 1;
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
      setCurrentIndex(idx);
    }
  };

  const handleVerticalScroll = (e) => {
    if (!shownScrollHint) return;
    const y = e.nativeEvent.contentOffset.y;
    if (y > 10) {
      setShownScrollHint(false);
      Animated.timing(scrollHintOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const priceDisplay =
    typeof active.price === "number" ? `$${active.price.toFixed(2)}` : "N/A";

  // dims/weight text
  const dims = active.dimensions || null;
  const dimsText =
    dims && (dims.height || dims.width || dims.length)
      ? `H: ${dims.height ?? "—"} x W: ${dims.width ?? "—"} x L: ${dims.length ?? "—"} in`
      : "Not specified";
  const weightText =
    typeof active.weight === "number"
      ? `${active.weight} lb`
      : active.weight
      ? String(active.weight)
      : "Not specified";

  const showLeft = currentIndex > 0;
  const showRight = currentIndex < images.length - 1;

  return (
    <ScreenTemplate>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator
          onScroll={handleVerticalScroll}
          scrollEventThrottle={16}
        >
          {/* Header: Artist card */}
          <View style={styles.cardHeader}>
            <View style={styles.artistLeft}>
              {!!profilePicture && (
                <Image source={{ uri: profilePicture }} style={styles.artistAvatar} />
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.artistName}>
                  {active.artistName || "Unknown Artist"}
                </Text>
                <Text style={styles.artistCategory}>
                  {active.category || "No Category"}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>👁</Text>
                <Text style={styles.statText}>{active.views || 0}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>❤️</Text>
                <Text style={styles.statText}>
                  {Array.isArray(active.likes) ? active.likes.length : likes}
                </Text>
              </View>
            </View>
          </View>

          {/* Image carousel */}
          <View style={styles.carouselWrap}>
            <FlatList
              ref={flatListRef}
              data={images}
              keyExtractor={(it, idx) => resolveItem(it)?._id || String(idx)}
              horizontal
              pagingEnabled
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={initialIndex || 0}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              decelerationRate={Platform.OS === "ios" ? "fast" : 0.9}
              bounces={false}
              overScrollMode="never"
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollToIndexFailed={onScrollToIndexFailed}
              renderItem={({ item: it }) => {
                const r = resolveItem(it);
                return (
                  <View style={styles.imageSlide}>
                    {r.imageLink ? (
                      <>
                        <Pressable onPress={() => setEnlarged(true)}>
                          <Image source={{ uri: r.imageLink }} style={styles.image} />
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
                      <Text style={{ color: "#c00" }}>Image not available</Text>
                    )}
                  </View>
                );
              }}
            />

            {showLeft && (
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
            {showRight && (
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

          {/* Title / description / like */}
          <View style={styles.cardFooter}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.artTitle}>{active.name}</Text>
              <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
                {images[currentIndex]?.description ||
                  images[currentIndex]?.image?.description ||
                  "No description available."}
              </Text>
            </View>

            <View style={styles.sideActions}>
              <TouchableOpacity
                style={[styles.primaryPill, hasLiked && styles.primaryPillActive]}
                onPress={handleToggleLike}
                activeOpacity={0.9}
              >
                <Image source={hasLiked ? likedIcon : like} style={styles.pillIcon} />
                <Text style={styles.pillText}>{hasLiked ? "Unlike" : "Like"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Purchase card */}
          <View style={styles.purchaseCard}>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{priceDisplay}</Text>
            </View>

            {active.isSold ? (
              <View style={[styles.buyNowButton, styles.soldButton]} pointerEvents="none">
                <Text style={styles.soldText}>SOLD</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.buyNowButton}
                onPress={() => {
                  if (active.isSold) return;
                  navigation.navigate("DeliveryDetails", {
                    imageId: active._id,
                    artName: active.name,
                    imageLink: active.imageLink,
                    artistName: active.artistName,
                    price: active.price,
                  });
                }}
                activeOpacity={0.9}
              >
                <Image source={cartIcon} style={styles.buyNowIcon} />
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Artwork Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dimensions</Text>
              <Text style={styles.detailValue}>{dimsText}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{weightText}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Signed</Text>
              <Text style={styles.detailValue}>
                {images[currentIndex]?.isSigned ?? images[currentIndex]?.image?.isSigned ? "Yes" : "No"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Framed</Text>
              <Text style={styles.detailValue}>
                {images[currentIndex]?.isFramed ?? images[currentIndex]?.image?.isFramed ? "Yes" : "No"}
              </Text>
            </View>
          </View>

          {shownScrollHint && (
            <Animated.View style={[styles.scrollHint, { opacity: scrollHintOpacity }]}>
              <Text style={styles.scrollHintText}>Scroll</Text>
              <Text style={styles.scrollHintChevron}>⌄</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Enlarged image modal */}
        <Modal
          visible={enlarged}
          transparent
          animationType="fade"
          onRequestClose={() => setEnlarged(false)}
        >
          <Pressable style={styles.enlargeModal} onPress={() => setEnlarged(false)}>
            <StatusBar hidden />
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              style={styles.enlargeTopFade}
              pointerEvents="none"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.enlargeBottomFade}
              pointerEvents="none"
            />

            <TouchableOpacity
              onPress={() => setEnlarged(false)}
              style={styles.enlargeCloseHit}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              activeOpacity={0.8}
            >
              <Text style={styles.enlargeCloseText}>✕</Text>
            </TouchableOpacity>

            {!!active.imageLink && (
              <Image source={{ uri: active.imageLink }} style={styles.enlargedImage} />
            )}
          </Pressable>
        </Modal>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FA" },
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
    width: 46,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
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
  carouselWrap: { marginHorizontal: 8, marginBottom: 8 },
  imageSlide: { width, alignItems: "center" },
  image: {
    width: width - 16,
    height: IMAGE_HEIGHT,
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
  },
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
  },
  artTitle: {
    fontSize: 18,
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
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginLeft: 6,
  },
  primaryPillActive: { backgroundColor: "#2563EB" },
  pillIcon: { width: 16, height: 16, tintColor: "#fff", marginRight: 8 },
  pillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  purchaseCard: {
    marginTop: 12,
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pricePill: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  priceText: { color: "#4338CA", fontWeight: "800", fontSize: 16, letterSpacing: 0.4 },
  buyNowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buyNowIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  buyNowText: { color: "#fff", fontWeight: "800", letterSpacing: 0.6, fontSize: 14 },
  soldButton: { backgroundColor: "#B91C1C", borderColor: "#7F1D1D", borderWidth: 1 },
  soldText: {
    color: "#fff",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 14,
    textTransform: "uppercase",
  },
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
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  detailLabel: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  detailValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
  scrollHint: { alignSelf: "center", marginTop: 10, alignItems: "center" },
  scrollHintText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  scrollHintChevron: { color: "#6B7280", fontSize: 20, marginTop: -2 },
  enlargeModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  enlargeTopFade: { position: "absolute", top: 0, left: 0, width: "100%", height: 120 },
  enlargeBottomFade: { position: "absolute", bottom: 0, left: 0, width: "100%", height: 140 },
  enlargedImage: { width: "100%", height: "100%", resizeMode: "contain" },
  enlargeCloseHit: {
    position: "absolute",
    top: 50,
    right: 24,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  enlargeCloseText: { color: "#fff", fontSize: 22, fontWeight: "800" },
});

export default ImageScreen;
