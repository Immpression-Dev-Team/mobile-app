import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Pressable, FlatList, Dimensions, ImageBackground } from 'react-native';
import Navbar from './Navbar';
import Scrollbars from './ScrollBars';
import FooterNavbar from '../components/FooterNavbar';

const { width } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [initialIndex]);

  const renderItem = ({ item, index }) => {
    const isCurrent = index === currentIndex;
    const isNext = index === currentIndex + 1;

    // Check if imageLink exists
    const currentImageLink = item.imageLink ? item.imageLink : null;

    return (
      <View style={styles.imageContainer}>
        {/* Show previous image if it exists */}
        {index === currentIndex - 1 && images[index - 1]?.imageLink && (
          <Image
            source={{ uri: images[index - 1].imageLink }}
            style={styles.previousImage}
          />
        )}
        {/* Show current image */}
        {currentImageLink ? (
          <Image source={{ uri: currentImageLink }} style={[styles.fullImage, isNext && styles.currentImage]} />
        ) : (
          <Text>No Image Available</Text> // Fallback if image link is missing
        )}
        {/* Show next image if it exists */}
        {isNext && images[index + 1]?.imageLink && (
          <Image
            source={{ uri: images[index + 1].imageLink }}
            style={styles.nextImage}
          />
        )}
      </View>
    );
  };

  const onViewRef = useRef(({ changed }) => {
    const current = changed.find(item => item.isViewable);
    if (current) {
      setCurrentIndex(current.index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
   
       <ImageBackground
          source={require("../assets/backgrounds/navbar-bg3.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => (
            { length: width, offset: width * index, index }
          )}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.artTitle}>{images[currentIndex]?.name || 'Untitled'}</Text>
          <View style={styles.scrollBar}>
            <Scrollbars />
          </View>
          <View style={styles.artistNameYearContainer}>
            <Text style={styles.artistName}>{images[currentIndex]?.artistName || 'Unknown Artist'}</Text>
            <View style={styles.verticalLine} />
            <Text style={styles.artYear}>{images[currentIndex]?.year || 'Unknown Year'}</Text>
          </View>
          <View style={styles.horizontalLine} />
          <Text style={styles.category}>{images[currentIndex]?.category || 'Category'}</Text>
          <Text style={styles.artDescription}>{images[currentIndex]?.description || 'No Description Available'}</Text>
          </View>
        <FooterNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: "100%",
    height: '100%',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginTop: -18,
  },
  currentImage: {
    zIndex: 2,
  },
  nextImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 300,
    opacity: 0.5,
    resizeMode: 'cover',
  },
  previousImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 300,
    opacity: 0.5,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scrollBar: {
    height: 80,
    width: '100%',
    marginVertical: 10,
  },
  artTitle: {
    color: '#333',
    fontSize: 28,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistNameYearContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  artistName: {
    color: 'black',
    fontSize: 16,
    marginBottom: 7,
    flex: 1,
    textAlign: 'center',
  },
  artYear: {
    color: 'black',
    fontSize: 16,
    marginBottom: 7,
    flex: 1,
    textAlign: 'center',
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    alignSelf: 'center',
    marginVertical: 15,
  },
  artDescription: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default ImageScreen;
