import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { artist, profilePic, galleryImages, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && initialIndex >= 0 && initialIndex < galleryImages.length) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
    } else {
      console.warn('Initial index is out of range');
    }
  }, [initialIndex, galleryImages]);

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
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.artistName}>{artist}</Text>
        <Image source={profilePic} style={styles.profileImage} />
      </View>
      <FlatList
        ref={flatListRef}
        data={galleryImages}
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
        <Text style={styles.artTitle}>{galleryImages[currentIndex].title}</Text>
        <View style={styles.artistNameYearContainer}>
          <Text style={styles.artistName}>{artist}</Text>
        </View>
        <Text style={styles.artDescription}>{galleryImages[currentIndex].description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
  },
  artistName: {
    fontSize: 24,
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 10,
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
    alignItems: 'center',
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
  artDescription: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  },
});

export default ArtistScreen;
