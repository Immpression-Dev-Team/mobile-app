import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Pressable, FlatList, Dimensions } from 'react-native';
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

    return (
      <View style={styles.imageContainer}>
        {/* Show previous image if it exists */}
        {index === currentIndex - 1 && (
          <Image
            source={{ uri: `data:${images[index - 1]?.imageData.contentType};base64,${images[index - 1]?.imageData.data}` }}
            style={styles.previousImage}
          />
        )}
        {/* Show current image */}
        <Image source={{ uri: `data:${item.imageData.contentType};base64,${item.imageData.data}` }} style={[styles.fullImage, isNext && styles.currentImage]} />
        {/* Show next image if it exists */}
        {isNext && (
          <Image
            source={{ uri: `data:${images[index + 1]?.imageData.contentType};base64,${images[index + 1]?.imageData.data}` }}
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
      <Navbar />
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
        <Text style={styles.artTitle}>{images[currentIndex].title}</Text>
        <View style={styles.scrollBar}>
          <Scrollbars />
        </View>
        <View style={styles.artistNameYearContainer}>
          <Text style={styles.artistName}>{images[currentIndex].name}</Text>
          <View style={styles.verticalLine} />
          <Text style={styles.artYear}>{images[currentIndex].year}</Text>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.artType}>{images[currentIndex].type}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.artDescription}>{images[currentIndex].description}</Text>
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
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
  },
  imageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: '80%',
    height: 300,
    resizeMode: 'cover',
  },
  currentImage: {
    zIndex: 2, // Ensure current image is on top
  },
  nextImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 300,
    opacity: 0.5, // Adjust opacity as needed
    resizeMode: 'cover',
  },
  previousImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 300,
    opacity: 0.5, // Adjust opacity as needed
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scrollBar: {
    height: 80,
    width: '100%',
  },
  artTitle: {
    color: 'blue',
    fontSize: 40,
    marginTop: 10,
  },
  artistNameYearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    fontSize: 18,
    marginBottom: 7,
    flex: 1,
    textAlign: 'center',
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: 'black',
  },
  horizontalLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  artType: {
    color: 'black',
    fontSize: 18,
    marginVertical: 15,
  },
  artDescription: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  }
});

export default ImageScreen;
