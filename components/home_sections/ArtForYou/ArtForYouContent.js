// ArtForYouContent.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image as RNImage,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';

const skeleton = require('../../../assets/skeleton.png');
const loadingGif = require('../../../assets/loading-gif.gif');
const slideLeftGif = require('../../../assets/slideLeft.gif');

const LazyImage = ({ art, style, reloadToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hadError, setHadError] = useState(false);

  // Bust cache on refresh
  const uri = useMemo(() => {
    if (!art?.imageLink) return null;
    const sep = art.imageLink.includes('?') ? '&' : '?';
    return `${art.imageLink}${sep}v=${reloadToken}`;
  }, [art?.imageLink, reloadToken]);

  useEffect(() => {
    setIsLoading(true);
    setHadError(false);
  }, [uri]);

  return (
    <View style={style}>
      {isLoading && !hadError && (
        <View style={[style, styles.placeholder]}>
          <RNImage source={loadingGif} style={styles.loadingGif} />
        </View>
      )}

      {hadError ? (
        <RNImage source={skeleton} style={style} />
      ) : (
        <ExpoImage
          key={`${art._id}-${reloadToken}`} // force remount on refresh
          source={{ uri }}
          style={[style, isLoading ? styles.hiddenImage : null]}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setHadError(true);
            setIsLoading(false);
          }}
          draggable={false}
        />
      )}
    </View>
  );
};

export default function ArtForYouContent({
  fadeAnim,
  imageChunks,
  scrollViewRef,
  isOverlayVisible,
  handleScrollEnd,
  handleImagePress,
  handleUserActivity,
  handleRefresh,
  isLoading,
}) {
  const [reloadToken, setReloadToken] = useState(0);

  // wrap your refresh to also bump reloadToken
  const onRefresh = async () => {
    try {
      await handleRefresh?.();
    } finally {
      setReloadToken(t => t + 1);
    }
  };

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const arrowAnim1 = useRef(new Animated.Value(0)).current;
  const arrowAnim2 = useRef(new Animated.Value(0)).current;
  const arrowAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOverlayVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      );
      pulseAnimation.start();

      const startArrowAnimations = () => {
        const arrowSequence = Animated.stagger(200, [
          Animated.sequence([
            Animated.timing(arrowAnim1, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(arrowAnim1, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(arrowAnim2, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(arrowAnim2, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(arrowAnim3, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(arrowAnim3, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]);
        Animated.loop(arrowSequence).start();
      };

      const t = setTimeout(startArrowAnimations, 500);
      return () => {
        clearTimeout(t);
        pulseAnimation.stop();
        slideAnim.setValue(50);
      };
    } else {
      slideAnim.setValue(50);
      pulseAnim.setValue(0);
      arrowAnim1.setValue(0);
      arrowAnim2.setValue(0);
      arrowAnim3.setValue(0);
    }
  }, [isOverlayVisible]);

  return (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleUserActivity}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={!!isLoading}
            onRefresh={onRefresh}
            tintColor="#635BFF"
            colors={['#635BFF']}
          />
        }
      >
        {imageChunks.map((chunk, chunkIndex) => (
          <View key={`chunk-${chunkIndex}`} style={styles.column}>
            {chunk.map((art, index) => (
              <Pressable
                key={`${art._id}-${reloadToken}`} // ensure subtree remount too
                onPress={() => handleImagePress?.(chunkIndex * 2 + index)}
                style={styles.imgContainer}
              >
                <LazyImage art={art} style={styles.image} reloadToken={reloadToken} />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      {isOverlayVisible && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.enhancedCard,
              {
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
              style={styles.gradientCard}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.swipeText}>Swipe →</Text>
              </View>

              <View style={styles.arrowContainer}>
                <Animated.View
                  style={[
                    styles.arrow,
                    {
                      opacity: arrowAnim1,
                      transform: [
                        {
                          translateX: arrowAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.arrowText}>›</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.arrow,
                    {
                      opacity: arrowAnim2,
                      transform: [
                        {
                          translateX: arrowAnim2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.arrowText}>›</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.arrow,
                    {
                      opacity: arrowAnim3,
                      transform: [
                        {
                          translateX: arrowAnim3.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.arrowText}>›</Text>
                </Animated.View>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 400 : 280,
    padding: 0,
  },
  scrollView: {
    flexGrow: 0,
  },
  column: {
    flexDirection: 'column',
    width: Platform.OS === 'web' ? 180 : 120,
    marginRight: Platform.OS === 'web' ? 16 : 8,
    gap: Platform.OS === 'web' ? 16 : 8,
  },
  imgContainer: {
    width: Platform.OS === 'web' ? 180 : 120,
    height: Platform.OS === 'web' ? 180 : 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    ...(Platform.OS === 'web' ? { objectFit: 'cover' } : {}),
  },
  overlay: {
    position: 'absolute',
    top: '35%',
    right: -30,
    transform: [{ translateY: -25 }],
    width: Platform.OS === 'web' ? 120 : 100,
    height: Platform.OS === 'web' ? 60 : 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  enhancedCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradientCard: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    paddingVertical: Platform.OS === 'web' ? 16 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 0,
  },
  swipeText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '700',
    color: '#2563EB',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  arrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: '#F8F9FA',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingGif: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  hiddenImage: {
    opacity: 0,
  },
});
