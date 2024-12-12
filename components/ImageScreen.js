import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import Navbar from "./Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { incrementImageViews } from "../API/API";
import { useAuth } from "../state/AuthProvider";

const share = require("../assets/icons/share-button.png");
const like = require("../assets/icons/like-button.png");
const likesIcon = require("../assets/icons/likes_icon.png");
const viewsIcon = require("../assets/icons/views_icon.png");
const { width } = Dimensions.get("window");

// Helper function to calculate responsive font size
const getResponsiveFontSize = (size) => {
  const scale = width / 375; // Base scale on a typical screen width (375 for iPhone 6/7/8)
  return Math.round(size * scale);
};

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const { token } = useAuth();

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
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/backgrounds/navbar_bg_blue.png")}
        style={styles.navbarBackgroundImage}
      >
        <Navbar />
      </ImageBackground>
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
            handleViewIncrement(index);
          }
        }}
      />
      <View style={styles.descriptionButtonContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.artTitle}>
            {images[currentIndex]?.name || "Untitled"}
          </Text>
          <Text style={styles.artistName}>
            BY:{" "}
            <Text style={styles.boldText}>
              {images[currentIndex]?.artistName || "Unknown Artist"}
            </Text>
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
          <TouchableOpacity style={styles.likeButton}>
            <Image source={like} style={styles.likeIcon} />
            <Text style={styles.likeText}>LIKE</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.likeViewCountCotainer}>
        <View style={styles.count}>
          <Image source={likesIcon} style={styles.likesIcon} />
          <Text style={styles.viewsCount}>
            {images[currentIndex]?.likes || 0}
          </Text>
        </View>
        <View style={styles.count}>
          <Image source={viewsIcon} style={styles.viewsIcon} />
          <Text style={styles.viewsCount}>
            {images[currentIndex]?.views || 0}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() =>
            navigation.navigate("DeliveryDetails", {
              artName: images[currentIndex]?.name, // Pass only the art name
              imageLink: images[currentIndex]?.imageLink, // Pass the image link
              artistName: images[currentIndex]?.artistName, // Pass the artist's name
              price: images[currentIndex]?.price, // Pass the price
            })
          }
        >
          <Text style={styles.buyNowButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
      <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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
    fontSize: getResponsiveFontSize(25),
    fontFamily: "Calibri",
    fontWeight: "bold",
    textAlign: "left",
    textTransform: "uppercase",
  },
  artistName: {
    color: "black",
    fontSize: 15,
    fontFamily: "Calibri",
    textAlign: "left",
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
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
    width: "95%",
    elevation: 8,
  },
  buyNowButtonText: {
    color: "#FFF",
    fontSize: 30, // Increased font size
    fontFamily: "Calibri",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  descriptionButtonContainer: {
    flexDirection: "row", // Align the description and buttons in a row
    justifyContent: "space-between", // Create space between description and buttons
    alignItems: "flex-start", // Align both to the top
    marginTop: 10, // Add some space between the description and buttons
    width: "100%", // Make it take the full width of the container
    paddingHorizontal: 15, // Add some padding on the sides for spacing
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
  likeViewCountCotainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  likesIcon: {
    width: 20,
    height: 20,
    margin: 8,
  },
  viewsIcon: {
    width: 20,
    height: 20,
    margin: 8,
  },
  viewsCount: {
    color: "gray",
    fontSize: 16,
    fontFamily: "Calibri",
  },
});

export default ImageScreen;
