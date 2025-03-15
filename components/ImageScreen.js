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
import { useAuth } from "../state/AuthProvider";
import { toggleLike, fetchLikeData, incrementImageViews, fetchUserProfilePicture } from "../API/API";
import ScreenTemplate from "../screens/Template/ScreenTemplate";
import PriceSliders from "./PriceSliders";

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

  useEffect(() => {
    console.log("Current Image Data:", images[currentIndex]);

    if (images[currentIndex]?.userId) {
      console.log(`Fetching profile picture for userId: ${images[currentIndex].userId}`);

      fetchUserProfilePicture(images[currentIndex].userId, token)
        .then((profilePic) => {
          console.log("Received profile picture link:", profilePic);
          setProfilePicture(profilePic);
        })
        .catch((error) => {
          console.error("Failed to fetch profile picture:", error);
        });
    } else {
      console.warn("No userId found for the current image.");
    }
  }, [currentIndex]);

  useEffect(() => {
    if (images[currentIndex]?._id) {
      handleFetchLikeData(images[currentIndex]._id);
      handleViewIncrement(currentIndex);
    }
  }, [currentIndex]);

  const handleFetchLikeData = async (imageId) => {
    if (!imageId) return;
    try {
      const data = await fetchLikeData(imageId, token);
      setLikes(data.likesCount);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const handleToggleLike = async () => {
    if (!images[currentIndex]?._id) return;
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
        console.log(`Incrementing views for image ID: ${currentImage._id}`);
        await incrementImageViews(currentImage._id, token);
      } catch (error) {
        console.error("Error incrementing image views:", error);
      }
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Artist Info + Likes/Views */}
        <View style={styles.headerContainer}>
          {/* Likes & Views Section - Now on the Left */}
          <View style={styles.likeViewCountContainer}>
            <View style={styles.count}>
              <Image source={likesIcon} style={styles.likesIcon} />
              <Text style={styles.viewsCount}>{likes}</Text>
            </View>
            <View style={styles.count}>
              <Image source={viewsIcon} style={styles.viewsIcon} />
              <Text style={styles.viewsCount}>
                {images[currentIndex]?.views || 0}
              </Text>
            </View>
          </View>

          {/* Artist Info - Now on the Right */}
          <View style={styles.artistContainer}>
            <Text style={styles.artistName}>
              <Text style={styles.boldText}>
                {images[currentIndex]?.artistName || "Unknown Artist"}
              </Text>
            </Text>
            {profilePicture && (
              <Image source={{ uri: profilePicture }} style={[styles.profilePicture, { marginLeft: 10, marginRight: 0 }]} />
            )}
          </View>
        </View>

        {/* Image List */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageLink }} style={styles.fullImage} />
            </View>
          )}
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
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            if (index !== currentIndex) {
              setCurrentIndex(index);
              handleFetchLikeData(images[index]._id);
              handleViewIncrement(index);
            }
          }}
        />

        {/* Description & Like Button */}
        <View style={styles.descriptionButtonContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.artTitle}>
              {images[currentIndex]?.name || "Untitled"}
            </Text>

            <Text style={styles.labelText}>
              CATEGORY:{" "}
              <Text style={styles.boldText}>
                {images[currentIndex]?.category || "No Category"}
              </Text>
            </Text>
            <Text style={styles.labelText}>
              DESCRIPTION:{" "}
              <Text style={styles.boldText}>
                {images[currentIndex]?.description || "No Description Available"}
              </Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.likeButton} onPress={handleToggleLike}>
            <Image source={hasLiked ? likedIcon : like} style={styles.likeIcon} />
            <Text style={styles.likeText}>{hasLiked ? "UNLIKE" : "LIKE"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceButtonContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ${images[currentIndex]?.price ? images[currentIndex].price.toFixed(2) : "N/A"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() =>
            navigation.navigate("PaymentScreen", {
              artName: images[currentIndex]?.name,
              imageLink: images[currentIndex]?.imageLink,
              artistName: images[currentIndex]?.artistName,
              price: images[currentIndex]?.price,
            })
          }
        >
          <Text style={styles.buyNowButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },

  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  profilePicture: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },

  artistName: {
    color: "black",
    fontSize: 15,
    fontFamily: "Calibri",
    textTransform: "uppercase",
  },

  likeViewCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  count: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  likesIcon: {
    width: 15,
    height: 15,
    marginRight: 2,
  },

  viewsIcon: {
    width: 15,
    height: 15,
    marginRight: 2,
  },

  viewsCount: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },

  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: height * 0.5, // 50% of the screen height for responsiveness
    resizeMode: "cover",
  },

  descriptionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  textContainer: {
    flex: 1,
  },

  artTitle: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  labelText: {
    color: "#000",
    fontSize: 12,
    textTransform: "uppercase",
  },

  boldText: {
    fontWeight: "bold",
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },

  likeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },

  likeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  buyNowButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: "center",
    flex: 1, // Allow button to take remaining space
    elevation: 8,
  },

  buyNowButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  
  priceButtonContainer: {
    flexDirection: "row", // Arrange price and button side by side
    alignItems: "center", // Align them vertically
    justifyContent: "space-between", // Distribute space
    width: "95%", // Make it responsive
    alignSelf: "center",
    marginVertical: 10,
  },

  priceContainer: {
    backgroundColor: "#D3D3D3", // Light gray background
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 0,
    borderWidth: 0,
    marginRight: 5, // Space between price and button
  },

  priceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ImageScreen;
