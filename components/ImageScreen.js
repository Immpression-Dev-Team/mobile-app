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
        await incrementImageViews(currentImage._id, token); // No need to update local view count
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
        <Text style={styles.artistName}>{images[currentIndex]?.artistName || "Unknown Artist"}</Text>
        <Text style={styles.categoryInfo}>{images[currentIndex]?.category || "No Category"}</Text>
        <Text style={styles.artDescription}>{images[currentIndex]?.description || "No Description Available"}</Text>
        <Text style={styles.viewsCount}>Views: {images[currentIndex]?.views || 0}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Message Artist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
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
    alignItems: "center",
  },
  artTitle: {
    color: "#333",
    fontSize: 30,
    textAlign: "center",
  },
  artistName: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
  },
  categoryInfo: {
    fontSize: 12,
    textAlign: "center",
  },
  artDescription: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  viewsCount: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    marginHorizontal: 10,
    borderRadius: 6,
    alignItems: "center",
    elevation: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default ImageScreen;
