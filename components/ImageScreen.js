import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScreenTemplate from "../screens/Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import {
  toggleLike,
  fetchLikeData,
  incrementImageViews,
  fetchUserProfilePicture,
  deleteImage,
  getUserProfile,
} from "../API/API";
import { promptLogin } from "../utils/loginPrompt";

const like = require("../assets/icons/like-button.jpg");
const likedIcon = require("../assets/icons/like-button.jpg");
const cartIcon = require("../assets/icons/shopping-cart.png");
const enlargeIcon = require("../assets/icons/enlarge.png");

const { width, height } = Dimensions.get("window");
const H_PADDING = 16;
const IMAGE_HEIGHT = Math.min(360, Math.max(260, height * 0.45));

/* ------------------------ helpers ------------------------ */
const pickId = (v) => {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object") return v._id || v.id || v.userId || v.uid || null;
  return null;
};

const extractIdFromProfile = (raw) => {
  if (!raw) return null;
  const candidates = [
    raw,
    raw.user,
    raw.data,
    raw.data?.user,
    raw.profile,
    raw.profile?.user,
    raw.result,
    raw.result?.user,
  ];
  for (const obj of candidates) {
    const id = pickId(obj);
    if (id) return String(id);
  }
  const leafs = [
    raw._id, raw.id, raw.userId, raw.uid,
    raw.user?._id, raw.user?.id, raw.user?.userId,
    raw.data?._id, raw.data?.id, raw.data?.userId,
    raw.data?.user?._id, raw.data?.user?.id,
  ];
  const leaf = leafs.find(Boolean);
  return leaf ? String(leaf) : null;
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded =
      (typeof atob === "function" ? atob(base64) : global?.atob?.(base64)) ||
      Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const resolveItem = (raw = {}) => {
  const nest = raw.image || raw.imageDoc || {};
  return {
    _id: raw._id || nest._id || null,
    imageLink: raw.imageLink || nest.imageLink || raw.uri || null,
    name: raw.name || raw.title || nest.name || nest.title || "Untitled",
    artistName:
      raw.artistName ||
      raw?.artist?.name ||
      nest.artistName ||
      nest?.artist?.name ||
      raw.sellerName ||
      raw?.user?.name ||
      "Unknown Artist",
    price:
      typeof raw.price === "number"
        ? raw.price
        : typeof nest.price === "number"
        ? nest.price
        : undefined,
    category: raw.category || nest.category || null,
    views:
      typeof raw.views === "number"
        ? raw.views
        : typeof nest.views === "number"
        ? nest.views
        : 0,
    userId:
      pickId(raw.userId) ||
      pickId(nest.userId) ||
      pickId(raw?.user) ||
      pickId(nest?.user) ||
      raw?.ownerId ||
      raw?.sellerId ||
      null,
    dimensions: raw.dimensions || nest.dimensions || null,
    weight:
      typeof raw.weight === "number"
        ? raw.weight
        : typeof nest.weight === "number"
        ? nest.weight
        : undefined,
    soldStatus: raw.soldStatus || nest.soldStatus,
    stage: raw.stage || nest.stage,
    isSold:
      !!raw.isSold ||
      String((raw.soldStatus || nest.soldStatus || "")).toLowerCase() === "sold" ||
      (raw.stage || nest.stage) === "sold",
    likes: Array.isArray(raw.likes) ? raw.likes : Array.isArray(nest.likes) ? nest.likes : undefined,
    description: raw.description || nest.description || raw?.image?.description || null,
    isSigned: raw.isSigned ?? nest.isSigned,
    isFramed: raw.isFramed ?? nest.isFramed,
  };
};

/* ------------------------ component ------------------------ */
const ImageScreen = ({ route, navigation }) => {
  const { images = [], initialIndex = 0, currentUserId: passedUserId, onDeleted } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [enlarged, setEnlarged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const flatListRef = useRef(null);
  const scrollHintOpacity = useRef(new Animated.Value(1)).current;

  const { token, user } = useAuth();

  // derive authed user id
  const [authedUserId, setAuthedUserId] = useState(() => {
    return (
      (user && (pickId(user) || pickId(user.user) || pickId(user.profile))) ||
      (passedUserId ? String(passedUserId) : null)
    );
  });

  // fetch from /get-profile if missing
  useEffect(() => {
    let mounted = true;
    if (!authedUserId && token) {
      (async () => {
        try {
          const prof = await getUserProfile(token);
          const id = extractIdFromProfile(prof);
          if (mounted && id) setAuthedUserId(String(id));
        } catch {}
      })();
    }
    return () => { mounted = false; };
  }, [token, authedUserId]);

  // decode JWT if still missing
  useEffect(() => {
    if (authedUserId || !token) return;
    const payload = decodeJwtPayload(token);
    const id =
      pickId(payload) ||
      pickId(payload?.user) ||
      pickId(payload?.data) ||
      payload?.sub ||
      payload?._id ||
      payload?.id ||
      payload?.userId ||
      null;
    if (id) setAuthedUserId(String(id));
  }, [token, authedUserId]);

  // active item + owner check
  const active = useMemo(() => resolveItem(images[currentIndex] || {}), [images, currentIndex]);
  const imageOwnerId = active?.userId ? String(pickId(active.userId)) : null;
  const isOwner = !!authedUserId && !!imageOwnerId && authedUserId === imageOwnerId;

  // likes/profile pic
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [shownScrollHint, setShownScrollHint] = useState(true);

  useEffect(() => {
    if (!active.userId) {
      setProfilePicture(null);
      return;
    }
    // Fetch profile picture (works without token for public profiles)
    fetchUserProfilePicture(active.userId, token)
      .then(setProfilePicture)
      .catch(() => setProfilePicture(null));
  }, [active.userId, token]);

  useEffect(() => {
    if (!active._id) return;
    (async () => {
      // Fetch like data if authenticated
      if (token) {
        try {
          const data = await fetchLikeData(active._id, token);
          setLikes(Number(data?.likesCount || 0));
          setHasLiked(!!data?.hasLiked);
        } catch {}
        try {
          await incrementImageViews(active._id, token);
        } catch {}
      }
    })();
  }, [active._id, token]);

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
    if (e.nativeEvent.contentOffset.y > 10) {
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

  const onPressDelete = () => {
    if (!active._id || !token) return;
    Alert.alert(
      "Delete this photo?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const res = await deleteImage(active._id, token);
              if (res?.success === false) throw new Error(res?.error || "Delete failed");
              if (typeof onDeleted === "function") onDeleted(active._id);
              navigation.goBack();
            } catch {
              Alert.alert("Delete failed", "Please try again.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenTemplate>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        {/* DEBUG USER-ID STRIP (commented out as requested)
        <View style={styles.debugBar}>
          <Text style={styles.debugText}>me: {authedUserId || "—"}</Text>
          <Text style={styles.debugText}>owner: {imageOwnerId || "—"}</Text>
          <Text style={styles.debugText}>match: {String(isOwner)}</Text>
        </View>
        */}

        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          onScroll={handleVerticalScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.artistLeft}>
              {!!profilePicture && (
                <Image source={{ uri: profilePicture }} style={styles.artistAvatar} />
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.artistName}>{active.artistName || "Unknown Artist"}</Text>
                <Text style={styles.artistCategory}>{active.category || "No Category"}</Text>
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

          {/* Carousel */}
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
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
              decelerationRate={Platform.OS === "ios" ? "fast" : 0.9}
              bounces={false}
              overScrollMode="never"
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollToIndexFailed={onScrollToIndexFailed}
              renderItem={({ item }) => {
                const r = resolveItem(item);
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
                <TouchableOpacity style={styles.swipeTapLeft} onPress={goPrev} activeOpacity={0.85}>
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
                <TouchableOpacity style={styles.swipeTapRight} onPress={goNext} activeOpacity={0.85}>
                  <Text style={styles.swipeChevron}>›</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Title/desc/like */}
          <View style={styles.cardFooter}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.artTitle}>{active.name}</Text>
              <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
                {active.description || "No description available."}
              </Text>
            </View>

            <View style={styles.sideActions}>
              <TouchableOpacity
                style={[styles.primaryPill, hasLiked && styles.primaryPillActive]}
                onPress={async () => {
                  // Check if user is authenticated
                  if (!token) {
                    promptLogin(navigation, "like this artwork");
                    return;
                  }

                  try {
                    const data = await toggleLike(active._id, token);
                    setLikes(Number(data?.likesCount || 0));
                    setHasLiked(!!data?.hasLiked);
                  } catch {}
                }}
                activeOpacity={0.9}
              >
                <Image source={hasLiked ? likedIcon : like} style={styles.pillIcon} />
                <Text style={styles.pillText}>{hasLiked ? "Unlike" : "Like"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Purchase */}
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

                  // Check if user is authenticated
                  if (!token) {
                    promptLogin(navigation, "make a purchase");
                    return;
                  }

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
                {(images[currentIndex]?.isSigned ??
                  images[currentIndex]?.image?.isSigned ??
                  active?.isSigned)
                  ? "Yes"
                  : "No"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Framed</Text>
              <Text style={styles.detailValue}>
                {(images[currentIndex]?.isFramed ??
                  images[currentIndex]?.image?.isFramed ??
                  active?.isFramed)
                  ? "Yes"
                  : "No"}
              </Text>
            </View>
          </View>

          {/* Owner Delete (below details, right-aligned) */}
          {isOwner && (
            <View style={styles.ownerDeleteCard}>
              <TouchableOpacity
                style={[styles.deleteButton, isDeleting && { opacity: 0.7 }]}
                onPress={onPressDelete}
                disabled={isDeleting}
                activeOpacity={0.9}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteText}>🗑  Delete Photo</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {shownScrollHint && (
            <Animated.View style={[styles.scrollHint, { opacity: scrollHintOpacity }]}>
              <Text style={styles.scrollHintText}>Scroll</Text>
              <Text style={styles.scrollHintChevron}>⌄</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Enlarged modal */}
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
            {!!active.imageLink && <Image source={{ uri: active.imageLink }} style={styles.enlargedImage} />}
          </Pressable>
        </Modal>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FA" },

  // kept for reference; JSX is commented out
  debugBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "rgba(17,24,39,0.85)",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  debugText: { color: "#fff", fontSize: 10 },

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

  swipeLeft: { position: "absolute", left: 0, top: 0, bottom: 0, width: 48, justifyContent: "center", zIndex: 5, elevation: 5 },
  swipeRight: { position: "absolute", right: 0, top: 0, bottom: 0, width: 48, justifyContent: "center", alignItems: "flex-end", zIndex: 5, elevation: 5 },
  swipeGrad: { position: "absolute", top: 0, bottom: 0, width: 48 },
  swipeTapLeft: { width: 44, height: 120, justifyContent: "center", alignItems: "flex-start", paddingLeft: 6 },
  swipeTapRight: { width: 44, height: 120, justifyContent: "center", alignItems: "flex-end", paddingRight: 6 },
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
  soldText: { color: "#fff", fontWeight: "900", letterSpacing: 1, fontSize: 14, textTransform: "uppercase" },

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
  detailsTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8, textAlign: "center" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  detailLabel: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  detailValue: { fontSize: 14, color: "#111827", fontWeight: "600" },

  // Owner delete card (mirrors purchaseCard but right-aligned)
  ownerDeleteCard: {
    marginTop: 12,
    marginHorizontal: H_PADDING - 4,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#7F1D1D",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  scrollHint: { alignSelf: "center", marginTop: 10, alignItems: "center" },
  scrollHintText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  scrollHintChevron: { color: "#6B7280", fontSize: 20, marginTop: -2 },

  enlargeModal: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.92)", justifyContent: "center", alignItems: "center" },
  enlargeTopFade: { position: "absolute", top: 0, left: 0, width: "100%", height: 120 },
  enlargeBottomFade: { position: "absolute", bottom: 0, left: 0, width: "100%", height: 140 },
  enlargedImage: { width: "100%", height: "100%", resizeMode: "contain" },
  enlargeCloseHit: { position: "absolute", top: 50, right: 24, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.35)", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  enlargeCloseText: { color: "#fff", fontSize: 22, fontWeight: "800" },
});

export default ImageScreen;
