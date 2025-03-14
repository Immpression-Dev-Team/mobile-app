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
const likedIcon = require("../assets/icons/like-button.jpg"); // Ensure this is a different icon
const likesIcon = require("../assets/icons/likes_icon.png");
const viewsIcon = require("../assets/icons/views_icon.jpg");

const { width } = Dimensions.get("window");

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const { token } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);


  useEffect(() => {
    console.log("Current Image Data:", images[currentIndex]); // Debugging log
  
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
        console.log(
          `Attempting to increment views for image ID: ${currentImage._id}`
        );
        await incrementImageViews(currentImage._id, token);
      } catch (error) {
        console.error("Error incrementing image views:", error);
      }
    } else {
      console.warn("No valid image ID (_id) to increment views.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageLink }} style={styles.fullImage} />
    </View>
  );

  return (
    <ScreenTemplate>
      <View style={styles.artistContainer}>
        {profilePicture && (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        )}

        <Text style={styles.artistName}>
          <Text style={styles.boldText}>
            {images[currentIndex]?.artistName || "Unknown Artist"}
          </Text>
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
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
        <View style={styles.shareLikeButton}>
          <TouchableOpacity style={styles.shareButton}>
            <Image source={share} style={styles.shareIcon} />
            <Text style={styles.shareText}>SHARE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={handleToggleLike}>
            <Image source={hasLiked ? likedIcon : like} style={styles.likeIcon} />
            <Text style={styles.likeText}>{hasLiked ? "UNLIKE" : "LIKE"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {images[currentIndex]?._id && <PriceSliders imageId={images[currentIndex]._id} />}
      </View>

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
  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  textContainer: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 20,
    paddingLeft: 0,
    top: 0,
    left: 0,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    width: "65%", // Adjust width for more space for text and description
    height: 200,
  },
  artTitle: {
    color: "#333",
    fontSize: 25,  // Removed getResponsiveFontSize
    fontFamily: "Calibri",
    fontWeight: "bold",
    textAlign: "left",
    textTransform: "uppercase",
  },
  artistContainer: {
    flexDirection: "row", // Align profile picture and artist name in a row
    alignItems: "center", // Vertically center items
    marginLeft: 10, // Add some spacing from the left
    marginTop: 10, // Adjust spacing from the top
  },

  profilePicture: {
    width: 35, // Adjust profile picture size
    height: 35,
    borderRadius: 17.5, // Makes it circular
    marginRight: 10, // Adds space between the image and text
  },

  artistName: {
    color: "black",
    fontSize: 15,
    fontFamily: "Calibri",
    textTransform: "uppercase",
  },

  labelText: {
    color: "black",
    fontSize: 9,
    fontFamily: "Calibri",
    textAlign: "left",
    textTransform: "uppercase",
  },
  boldText: {
    fontWeight: "bold",
  },

  buttonContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    paddingVertical: 10,
    alignItems: "center",
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

  descriptionButtonContainer: {
    flexDirection: "row", // Align the description and buttons in a row
    justifyContent: "space-between", // Create space between description and buttons
    alignItems: "flex-start", // Align both to the top
    marginTop: 10, // Add some space between the description and buttons
    width: "100%", // Make it take the full width of the container
    paddingHorizontal: 15, // Add some padding on the sides for spacing
    marginBottom: -120,
  },
  shareLikeButton: {
    flexDirection: "column", // Align buttons vertically
    justifyContent: "flex-start", // Align buttons to the top
    width: "30%", // Take up 30% of the width for the buttons container
    alignItems: "flex-end", // Align buttons to the right
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5, // Add margin between the buttons
    paddingVertical: 5,
    borderRadius: 3,
    width: 80,
    height: 30,
  },
  shareIcon: {
    width: 15,
    height: 20,
    margin: 5,
  },

  shareText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
  },
  likeButton: {
    paddingVertical: 5,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 30,
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
  likeViewCountContainer: {
    position: "absolute",
    top: 10, // Adjust this value to fine-tune placement
    left: 10, // Adjust for left alignment
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black for visibility
    padding: 3,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 7,
  },
  likesIcon: {
    width: 15,
    height: 15,
    marginRight: 2,
    marginLeft: 4,
  },
  viewsIcon: {
    width: 15,
    height: 15,
    marginRight: 2,
  },
  viewsCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ImageScreen;
