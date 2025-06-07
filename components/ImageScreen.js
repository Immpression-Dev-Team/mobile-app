import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../state/AuthProvider';
import {
  fetchUserProfilePicture,
  getImage,
  incrementImageViews,
} from '../API/API';
import ScreenTemplate from '../screens/Template/ScreenTemplate';
import { useLike } from '../hooks/useLike';
import axios from 'axios';

const like = require('../assets/icons/like-button.jpg');
const likedIcon = require('../assets/icons/like-button.jpg');
const likesIcon = require('../assets/icons/likes_icon.png');
const viewsIcon = require('../assets/icons/views_icon.jpg');

const { width, height } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { images, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const { token, userData } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const currentImage = images[currentIndex];

  console.log('currentimage', JSON.stringify(currentImage, null, 2));

  const isInitiallyLiked = currentImage?.likes?.includes(
    userData?.user?.user._id
  );

  const {
    likes,
    hasLiked,
    toggleLike: handleToggleLike,
    isLoading: isLikeLoading,
    error: likeError,
  } = useLike(
    currentImage?.likes?.length || 0,
    isInitiallyLiked || false,
    isInitiallyLiked || false,
    currentImage?._id,
    token
  );

  // Memoized fetch profile picture function
  const fetchProfilePicture = useCallback(
    async (userId) => {
      if (!userId) return;

      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const profilePic = await fetchUserProfilePicture(userId, token);
        setProfilePicture(profilePic);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
        setProfileError('Failed to load profile picture');
      } finally {
        setIsLoadingProfile(false);
      }
    },
    [token]
  );

  // Memoized view increment function
  const handleViewIncrement = useCallback(
    async (imageId) => {
      if (!imageId) return;
      try {
        await incrementImageViews(imageId, token);
      } catch (error) {
        console.error('Error incrementing image views:', error);
      }
    },
    [token]
  );

  // Effect for handling image changes
  useEffect(() => {
    if (!currentImage) return;

    // Fetch profile picture when image changes
    if (currentImage.userId) {
      fetchProfilePicture(currentImage.userId);
    }

    // Increment views when image changes
    handleViewIncrement(currentImage._id);
  }, [currentIndex, currentImage, fetchProfilePicture, handleViewIncrement]);

  // Handle FlatList scroll
  const handleScrollEnd = useCallback(
    (event) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [currentIndex]
  );

  // Render loading state if no current image
  if (!currentImage) {
    return (
      <ScreenTemplate>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading image...</Text>
        </View>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Artist Info + Likes/Views */}
        <View style={styles.headerContainer}>
          {/* Likes & Views Section */}
          <View style={styles.likeViewCountContainer}>
            <View style={styles.count}>
              <Image source={likesIcon} style={styles.likesIcon} />
              <Text style={styles.viewsCount}>{likes}</Text>
            </View>
            <View style={styles.count}>
              <Image source={viewsIcon} style={styles.viewsIcon} />
              <Text style={styles.viewsCount}>{currentImage?.views || 0}</Text>
            </View>
          </View>

          {/* Artist Info */}
          <View style={styles.artistContainer}>
            <Text style={styles.artistName}>
              <Text style={styles.boldText}>
                {currentImage?.artistName || 'Unknown Artist'}
              </Text>
            </Text>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" style={styles.profileLoading} />
            ) : profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
          </View>
        </View>

        {/* Image List */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageLink }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          )}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={handleScrollEnd}
        />

        {/* Description & Like Button */}
        <View style={styles.descriptionButtonContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.artTitle}>
              {currentImage?.name || 'Untitled'}
            </Text>

            <Text style={styles.labelText}>
              CATEGORY:{' '}
              <Text style={styles.boldText}>
                {currentImage?.category || 'No Category'}
              </Text>
            </Text>
            <Text style={styles.labelText}>
              DESCRIPTION:{' '}
              <Text style={styles.boldText}>
                {currentImage?.description || 'No Description Available'}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.likeButton, hasLiked && styles.likedButton]}
            onPress={handleToggleLike}
            disabled={isLikeLoading}
          >
            {isLikeLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Image
                  source={hasLiked ? likedIcon : like}
                  style={styles.likeIcon}
                />
                <Text style={styles.likeText}>
                  {hasLiked ? 'UNLIKE' : 'LIKE'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Messages */}
        {likeError && <Text style={styles.errorText}>{likeError}</Text>}
        {profileError && <Text style={styles.errorText}>{profileError}</Text>}
      </View>

      {/* Price and Buy Now Button */}
      <View style={styles.priceButtonContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ${currentImage?.price?.toFixed(2) || 'N/A'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() =>
            navigation.navigate('PaymentScreen', {
              artName: currentImage?.name,
              imageLink: currentImage?.imageLink,
              artistName: currentImage?.artistName,
              price: currentImage?.price,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 3.5,
    paddingVertical: 5,
    backgroundColor: '#FFF',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginLeft: 10,
  },
  profileLoading: {
    marginLeft: 10,
  },
  artistName: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Calibri',
    textTransform: 'uppercase',
    marginBottom: -10,
  },
  likeViewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '98.5%',
    height: height * 0.5,
  },
  descriptionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  textContainer: {
    flex: 1,
  },
  artTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  labelText: {
    color: '#000',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  boldText: {
    fontWeight: 'bold',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  likedButton: {
    backgroundColor: '#FF0000',
  },
  likeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  likeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: 'center',
    flex: 1,
    elevation: 8,
  },
  buyNowButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  priceButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  priceContainer: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 0,
    borderWidth: 0,
    marginRight: 5,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default ImageScreen;
