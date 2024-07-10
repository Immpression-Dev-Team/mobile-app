import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Pressable, ScrollView, Dimensions, FlatList } from 'react-native';
import ScrollBar from './ScrollBar';
const { width } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the initial index when component mounts
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [initialIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.path} style={styles.fullImage} />
    </View>
  );

  const onViewRef = useRef(({ changed }) => {
    const current = changed.find(item => item.isViewable);
    if (current) {
      setCurrentIndex(current.index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
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
      <ScrollView style={styles.textContainer}>
        <Text style={styles.artTitle}>{images[currentIndex].artTitle}</Text>
        <View style={styles.scrollBar}>
          <ScrollBar />
        </View>
        <View style={styles.artistNameYearContainer}>
          <Text style={styles.artistName}>{images[currentIndex].artistName}</Text>
          <View style={styles.verticalLine} />
          <Text style={styles.artYear}>{images[currentIndex].artYear}</Text>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.artType}>{images[currentIndex].artType}</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.artDescription}>{images[currentIndex].artDescription}</Text>
      </ScrollView>
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
    top: 50,
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
  },
  fullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
  },
  scrollBar: {
    height: 80,
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