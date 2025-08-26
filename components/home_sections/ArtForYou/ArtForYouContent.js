import { useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const skeleton = require('../../../assets/skeleton.png');
const loadingGif = require('../../../assets/loading-gif.gif');

const slideLeftGif = require('../../../assets//slideLeft.gif');

const LazyImage = ({ art, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={style}>
      {isLoading && (
        <View style={[style, styles.placeholder]}>
          <Image source={loadingGif} style={styles.loadingGif} />
        </View>
      )}
      <Image
        source={{ uri: art.imageLink }}
        style={[style, isLoading ? styles.hiddenImage : null]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        loading="lazy"
        defaultSource={skeleton}
      />
    </View>
  );
};

// const LazyImage = ({ art, style }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [inView, setInView] = useState(false);

//   // const { ref, inview } = useInView({ threshold: 0.1 });

//   return (
//     <View onChange={setInView} style={style}>
//       {isLoading && (
//         <SkeletonPlaceholder>
//           <SkeletonPlaceholder.Item
//             width={'100%'}
//             height={'100%'}
//             borderRadius={0}
//           />
//         </SkeletonPlaceholder>
//       )}
//       {inView && (
//         <Image
//           source={{ uri: art.imageLink }}
//           style={[style, isLoading ? styles.hiddenImage : null]}
//           onLoadStart={() => setIsLoading(true)}
//           onLoadEnd={() => setIsLoading(false)}
//           loading="lazy"
//         />
//       )}
//     </View>
//   );
// };

export default function ArtForYouContent({
  fadeAnim,
  imageChunks,
  scrollViewRef,
  isOverlayVisible,
  handleScrollEnd,
  handleImagePress,
  handleUserActivity,
}) {
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
      >
        {imageChunks.map((chunk, chunkIndex) => (
          <View key={`chunk-${chunkIndex}`} style={styles.column}>
            {chunk.map((art, index) => (
              <Pressable
                key={art._id}
                onPress={() => handleImagePress(chunkIndex * 2 + index)}
                style={styles.imgContainer}
              >
                <LazyImage art={art} style={styles.image} />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      {isOverlayVisible && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <View style={styles.card}>
            <Image source={slideLeftGif} style={styles.cardImage} />
            <Text style={styles.cardText}>Scroll</Text>
          </View>
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
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: -5,
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: 30,
    height: 30,
    marginRight: 5,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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
