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

const { width } = Dimensions.get("window");

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const { token } = useAuth();

  const handleViewIncrement = async (index) => {
    const currentImage = images[index];
    if (currentImage && currentImage._id) {
      try {
        console.log(`Attempting to increment views for image ID: ${currentImage._id}`);
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
      <View style={styles.textContainer}>
        <Text style={styles.artTitle}>{images[currentIndex]?.name || "Untitled"}</Text>
        <Text style={styles.labelText}>
          BY: <Text style={styles.boldText}>{images[currentIndex]?.artistName || "Unknown Artist"}</Text>
        </Text>
        <Text style={styles.labelText}>
          CATEGORY: <Text style={styles.boldText}>{images[currentIndex]?.category || "No Category"}</Text>
        </Text>
        <Text style={styles.labelText}>
          DESCRIPTION: <Text style={styles.boldText}>{images[currentIndex]?.description || "No Description Available"}</Text>
        </Text>
        <Text style={styles.viewsCount}>Views: {images[currentIndex]?.views || 0}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buyNowButton}>
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
    paddingBottom: 20,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  artTitle: {
    color: "#333",
    fontSize: 30,
    fontFamily: "Calibri",
    fontWeight: "bold",
    textAlign: "left",
    textTransform: "uppercase",
  },
  labelText: {
    color: "black",
    fontSize: 15,
    fontFamily: "Calibri",
    textAlign: "left",
    textTransform: "uppercase",
  },
  boldText: {
    fontWeight: "bold",
  },
  viewsCount: {
    color: "gray",
    fontSize: 14,
    fontFamily: "Calibri",
    textAlign: "left",
    marginTop: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  buyNowButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    width: "90%",
    marginHorizontal: 20,
    elevation: 8,
  },
  buyNowButtonText: {
    color: "#FFF",
    fontSize: 18, // Increased font size
    fontFamily: "Calibri",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ImageScreen;
