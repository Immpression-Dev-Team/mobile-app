import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../state/AuthProvider";
import {
  toggleLike,
  fetchLikeData,
  incrementImageViews,
  fetchUserProfilePicture,
} from "../API/API";
import ScreenTemplate from "../screens/Template/ScreenTemplate";

const share = require("../assets/icons/share-button.jpg");
const like = require("../assets/icons/like-button.jpg");
const likedIcon = require("../assets/icons/like-button.jpg");
const likesIcon = require("../assets/icons/likes_icon.png");
const viewsIcon = require("../assets/icons/views_icon.jpg");

const { width, height } = Dimensions.get("window");

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const { token } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    if (images[currentIndex]?.userId) {
      fetchUserProfilePicture(images[currentIndex].userId, token)
        .then(setProfilePicture)
        .catch(console.error);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (images[currentIndex]?._id) {
      handleFetchLikeData(images[currentIndex]._id);
      handleViewIncrement(currentIndex);
    }
  }, [currentIndex]);

  const handleFetchLikeData = async (imageId) => {
    try {
      const data = await fetchLikeData(imageId, token);
      setLikes(data.likesCount);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const data = await toggleLike(images[currentIndex]._id, token);
      setLikes(data.likesCount);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error("Error liking/unliking image:", error);
    }
  };

  const handleViewIncrement = async (index) => {
    const currentImage = images[index];
    if (currentImage && currentImage._id) {
      try {
        await incrementImageViews(currentImage._id, token);
      } catch (error) {
        console.error("Error incrementing image views:", error);
      }
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.artistCard}>
          <View style={styles.artistCardLeft}>
            {profilePicture && (
              <Image
                source={{ uri: profilePicture }}
                style={styles.artistProfilePicture}
              />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.artistName}>
                {images[currentIndex]?.artistName || "Unknown Artist"}
              </Text>
              <Text style={styles.artistCategory}>
                {images[currentIndex]?.category || "No Category"}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>👁</Text>
              <Text style={styles.statText}>{images[currentIndex]?.views || 0}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>{images[currentIndex]?.likes?.length || 0}</Text>
            </View>
          </View>
        </View>

        {/* Image Gallery */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            if (index !== currentIndex) {
              setCurrentIndex(index);
              handleFetchLikeData(images[index]._id);
              handleViewIncrement(index);
              setShowMoreInfo(false);
            }
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer} key={item._id}>
              {item.imageLink ? (
                <>
                  <TouchableOpacity
                    onPress={() => setEnlarged(true)}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ uri: item.imageLink }}
                      style={styles.fullImage}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.enlargeIcon}
                    onPress={() => setEnlarged(true)}
                  >
                    <Image
                      source={require("../assets/icons/enlarge.png")}
                      style={styles.enlargeIconImage}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={{ color: "red" }}>Image not available</Text>
              )}
            </View>
          )}

        />

        {/* Enlarged Overlay */}
        {enlarged && (
          <View style={styles.enlargedOverlay}>
            {/* Top Fade */}
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
              style={styles.topFade}
              pointerEvents="none"
            />

            {/* Bottom Fade */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.bottomFade}
              pointerEvents="none"
            />

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setEnlarged(false)}
              style={styles.closeOverlay}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Centered Image */}
            <Image
              source={{ uri: images[currentIndex]?.imageLink }}
              style={styles.enlargedImage}
            />
          </View>
        )}

        {/* Description + Like */}
        <View style={styles.descriptionContainer}>
          <View style={{ flex: 1, maxWidth: "72%" }}>
            <Text style={styles.artTitle}>
              {images[currentIndex]?.name || "Untitled"}
            </Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={6}
              ellipsizeMode="tail"
            >
              {images[currentIndex]?.description || "No Description Available"}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              style={styles.likeButtonNew}
              onPress={handleToggleLike}
            >
              <Image
                source={hasLiked ? likedIcon : like}
                style={styles.likeIconNew}
              />
              <Text style={styles.likeButtonTextNew}>
                {hasLiked ? "Unlike" : "Like"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreInfoButton}
              onPress={() => setShowMoreInfo(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.moreInfoText}>ⓘ More Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Info Card */}
        {showMoreInfo && (
          <View style={styles.infoCard}>
            <TouchableOpacity
              onPress={() => setShowMoreInfo(false)}
              style={styles.closeX}
            >
              <Text style={styles.closeXText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.infoTitle}>Artwork Details</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dimensions:</Text>
              <Text style={styles.infoValue}>
                {images[currentIndex]?.dimensions || "Not specified"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Signed:</Text>
              <Text style={styles.infoValue}>
                {images[currentIndex]?.isSigned ? "Yes" : "No"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Framed:</Text>
              <Text style={styles.infoValue}>
                {images[currentIndex]?.isFramed ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        )}

        {/* Price + Buy Now */}
        <View style={styles.purchaseRow}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>
              ${images[currentIndex]?.price?.toFixed(2) || "N/A"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={() =>
              navigation.navigate("DeliveryDetails", {
                imageId: images[currentIndex]?._id,
                artName: images[currentIndex]?.name,
                imageLink: images[currentIndex]?.imageLink,
                artistName: images[currentIndex]?.artistName,
                price: images[currentIndex]?.price,
              })
            }
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/icons/shopping-cart.png")}
              style={styles.buyNowIcon}
            />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenTemplate>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    // borderBottomWidth: 0.5,
    // borderColor: "#ddd",
  },
  artistInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePictureSquare: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  artistNameLeft: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    textTransform: "uppercase",
  },
  categoryLabel: {
    fontSize: 12,
    color: "#777",
    textTransform: "uppercase",
    marginTop: 2,
  },
  statsRowRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  statPillRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statIconRight: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: "#444",
  },
  statTextRight: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statIcon: {
    marginRight: 6,
  },

  statText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },

  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width - 10, // subtract horizontal margins (5 left + 5 right)
    height: height * 0.5,
    resizeMode: 'cover',
    borderRadius: 8, // optional: match corner rounding
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    zIndex: 1,
  },

  artTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  descriptionText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    maxHeight: 95,
    overflow: "hidden",
    flexShrink: 1,
  },
  likeButtonNew: {
    flexDirection: "row",
    justifyContent: "center", // <--- centers the icon + text as a group
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 6,
    alignSelf: "center", // <--- optional: centers the button in its container
  },

  likeIconNew: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#fff",
  },
  likeButtonTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  moreInfoButton: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f2f2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  moreInfoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  infoCard: {
    position: "absolute",
    bottom: 90,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 2,
  },
  closeX: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 1,
  },
  closeXText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  priceButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    // borderTopWidth: 1,
    // borderColor: "#e0e0e0",
  },
  priceBadge: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  buyNowButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 4,
  },
  buyNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  artistCard: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  artistCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistProfilePicture: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  artistCategory: {
    fontSize: 12,
    color: '#635BFF',
    backgroundColor: '#EAEAFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  statsContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  likeButton: {
    width: 22,
    height: 22,
    marginTop: 4,
  },
  purchaseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  pricePill: {
    backgroundColor: "#EAEAFF",
    borderColor: "#635BFF",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  priceText: {
    color: "#635BFF",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.4,
  },

  buyNowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  buyNowIcon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
    marginRight: 8,
  },

  buyNowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  enlargedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  
  enlargedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 100,
    zIndex: 998,
  },
  
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 100,
    zIndex: 998,
  },
  
  closeOverlay: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  
  closeText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  
  closeOverlay: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 1000,
  },

  closeText: {
    fontSize: 30,
    color: "#fff",
  },
  enlargeIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
    zIndex: 5,
  },
  enlargeIconImage: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },


});

export default ImageScreen;
