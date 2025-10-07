import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import {
  getUserImages,
  fetchLikedImages,
  incrementImageViews,
} from "../API/API";
import { useAuth } from "../state/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import ScreenTemplate from "../screens/Template/ScreenTemplate";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../API_URL";

const screenWidth = Dimensions.get("window").width;

const filterTypes = [
  { label: "Selling", value: "selling" },
  { label: "Liked", value: "liked" },
];

// small helpers (UI-only)
const withOverlayFields = (raw, { fallbackArtist }) => {
  const img = raw.image || raw.imageDoc || raw;
  return {
    ...raw, // keep everything for ImageScreen
    title: raw.title || img.title || raw.name || img.name || "Untitled",
    artistName:
      raw.artistName ||
      img.artistName ||
      raw?.artist?.name ||
      img?.artist?.name ||
      raw.sellerName ||
      raw?.user?.name ||
      fallbackArtist ||
      "Unknown Artist",
  };
};

const GalleryView = ({ route }) => {
  const initialType = route?.params?.type === "liked" ? "liked" : "selling";
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();
  const currentUserName = userData?.user?.user?.name;

  const [images, setImages] = useState([]);
  const [activeType, setActiveType] = useState(initialType);

  // detail fetch for selling enrichment
  const fetchImageById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/image/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend returns { ...fields } (not wrapped); standardize:
      return res.data?.image ? res.data.image : res.data;
    } catch (e) {
      console.warn("fetchImageById failed for", id, e?.response?.data || e?.message);
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        if (activeType === "liked") {
          const liked = await fetchLikedImages(token);
          const list = Array.isArray(liked?.images) ? liked.images : [];
          const enriched = list.map((it) =>
            withOverlayFields(it, { fallbackArtist: undefined })
          );
          setImages(enriched);
        } else {
          // SELLING: minimal -> enrich each with /image/:id
          const res = await getUserImages(token);
          const mine = Array.isArray(res?.images) ? res.images : [];
          const selling = mine.filter((img) => img.stage === "approved");

          const enriched = await Promise.all(
            selling.map(async (s) => {
              const detail = await fetchImageById(s._id);
              // merge minimal + detail (detail wins), then add overlay fields
              const merged = { ...s, ...(detail || {}) };
              return withOverlayFields(merged, { fallbackArtist: currentUserName });
            })
          );

          setImages(enriched.filter(Boolean));
        }
      } catch (err) {
        console.error("Error fetching gallery images:", err?.message || err);
        setImages([]);
      }
    })();
  }, [activeType, token, currentUserName]);

  const handleImagePress = async (image, index) => {
    try {
      if (image?._id) await incrementImageViews(image._id, token);
    } catch (err) {
      console.error("Error incrementing image views:", err);
    } finally {
      // 🚫 do NOT remap/strip fields — pass them through completely
      navigation.navigate("ImageScreen", {
        images,                // full enriched objects
        initialIndex: index,
      });
    }
  };

  const RenderItem = ({ item, index }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        friction: 6,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    };

    const isSold =
      String(item?.soldStatus || "").toLowerCase() === "sold" ||
      item?.stage === "sold" ||
      item?.isSold;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleImagePress(item, index)}
      >
        <Animated.View
          style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          {isSold && (
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>SOLD</Text>
            </View>
          )}

          <Image
            source={{ uri: item.imageLink }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <View style={styles.cardInfoOverlay}>
            <Text style={styles.artTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.artArtist} numberOfLines={1}>
              {item.artistName}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>
              {filterTypes.find((f) => f.value === activeType).label}
            </Text>
            <Text style={styles.count}>
              {images.length} {images.length === 1 ? "image" : "images"}
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filterTypes.map((filter) => {
            const active = activeType === filter.value;
            return (
              <TouchableOpacity
                key={filter.value}
                style={[styles.filterButton, active && styles.filterButtonActive]}
                onPress={() => setActiveType(filter.value)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {images.length === 0 ? (
          <Text style={styles.emptyText}>No artwork found in this folder.</Text>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item, i) => String(item._id || item.imageLink || i)}
            numColumns={2}
            contentContainerStyle={styles.gallery}
            renderItem={RenderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 8 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#222" },
  count: { fontSize: 12, color: "#777", marginTop: 2 },
  filterContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#F7F7F8",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8EA",
  },
  filterButton: { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  filterButtonActive: { backgroundColor: "#333" },
  filterText: { color: "#444", fontSize: 12, letterSpacing: 0.2, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  gallery: { paddingBottom: 50 },
  cardContainer: {
    width: screenWidth / 2 - 16,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  cardImage: { width: "100%", height: 180 },
  cardInfoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  artTitle: { fontSize: 13, fontWeight: "700", color: "#fff" },
  artArtist: { fontSize: 11, color: "#EDEDED", marginTop: 2 },
  ribbon: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
    backgroundColor: "#FF5A5F",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ribbonText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
});

export default GalleryView;
