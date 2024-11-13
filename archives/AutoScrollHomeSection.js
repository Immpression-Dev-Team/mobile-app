import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Pressable, Dimensions } from 'react-native';

const imagePaths = [
    require('../../assets/art/art5.png'),
    require('../../assets/art/art2.png'),
    require('../../assets/art/art3.png'),
    require('../../assets/art/art4.png'),
    require('../../assets/art/art1.jpg'),
    require('../../assets/art/art6.png'),
    require('../../assets/photos/mountain.jpg'),
    require('../../assets/photos/grass.jpg'),
    require('../../assets/photos/building.jpg'),
    require('../../assets/photos/man.jpg'),
    require('../../assets/photos/hand.jpg'),
    require('../../assets/photos/gray.jpg'),
    require('../../assets/photos/path.jpg'),
    require('../../assets/photos/animal.jpg'),
    require('../../assets/photos/sunset.jpg'),
    require('../../assets/photos/deer.jpg'),
];

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const ArtForYou2 = () => {
    const scrollViewRef = useRef(null);
    const [images, setImages] = useState([...imagePaths]);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const inactivityTimeoutRef = useRef(null);
    useEffect(() => {
        let interval;
    
        if (isAutoScrolling) {
          interval = setInterval(() => {
            scrollY.current += 500; // Adjust this value to change the scroll amount per interval
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ y: scrollY.current, animated: true });
            }
          }, scrollSpeed); // Use the scrollSpeed state for interval duration
        }
    
        return () => clearInterval(interval);
      }, [isAutoScrolling, scrollSpeed]); // Depend on scrollSpeed
    
    const imageChunks = chunkArray(images, 2); // Chunk into groups of 2 images

    useEffect(() => {
        let autoScrollInterval;

        if (isAutoScrolling) {
            autoScrollInterval = setInterval(() => {
                setScrollPosition((prevPosition) => {
                    const screenWidth = Dimensions.get('window').width;
                    const newPosition = prevPosition + screenWidth / 60; // Adjust the speed as needed
                    scrollViewRef?.current?.scrollTo({ x: newPosition, animated: true });
                    return newPosition;
                });
            }, 100); // Adjust the speed as needed
        }

        return () => clearInterval(autoScrollInterval);
    }, [isAutoScrolling]);

    useEffect(() => {
        const screenWidth = Dimensions.get('window').width;
        const contentWidth = imageChunks.length * 112; // 112 is the width of one image column plus margin

        if (scrollPosition >= contentWidth - screenWidth * 2) {
            setImages((prevImages) => [...prevImages, ...imagePaths]);
        }
    }, [scrollPosition, imageChunks]);

    const handleUserInteraction = () => {
        setIsAutoScrolling(false);
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        inactivityTimeoutRef.current = setTimeout(() => {
            setIsAutoScrolling(true);
        }, 5000); // 5 seconds of inactivity
    };

    return (
        <View style={styles.section}>
            <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <Text style={styles.header}>Art For You</Text>
                </View>
                <Pressable
                    style={styles.rightHeader}
                    onPress={() => setIsAutoScrolling((prev) => !prev)}
                >
                    <Text style={styles.secondaryHeader}>
                        {isAutoScrolling ? 'Discovering' : 'Discover'}
                    </Text>
                </Pressable>
            </View>
            <Pressable onPressIn={handleUserInteraction}>
                <ScrollView
                    horizontal
                    style={styles.scrollView}
                    ref={scrollViewRef}
                    scrollEventThrottle={16}
                    onScrollBeginDrag={handleUserInteraction}
                    onTouchStart={handleUserInteraction}
                    showsHorizontalScrollIndicator={false} // Disable horizontal scrollbar
                    onScroll={(event) => {
                        setScrollPosition(event.nativeEvent.contentOffset.x);
                    }}
                >
                    {/* Render large image as its own component/section */}
                    <View style={styles.largeImageContainer}>
                        <Image
                            source={images[0]} // Assuming first image is the large one
                            style={styles.largeImage}
                        />
                    </View>

                    {/* Render smaller images in subsequent sections */}
                    {imageChunks.slice(1).map((chunk, chunkIndex) => (
                        <View key={chunkIndex} style={styles.column}>
                            {chunk.map((path, index) => (
                                <Image
                                    key={index}
                                    source={path}
                                    style={styles.image}
                                />
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center items
        marginBottom: 2,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
    },
    leftHeader: {
        backgroundColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 2,
        borderTopLeftRadius: 10,
    },
    rightHeader: {
        backgroundColor: '#B7C9E2',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopRightRadius: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 158, // Add some space between the titles
    },
    secondaryHeader: {
        fontSize: 15,
        color: 'black',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 2, // Margin between columns
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 2, // Margin between images in a column
        borderRadius: 0,
    },
    largeImageContainer: {
        marginRight: 2, // Margin between large image and subsequent images
    },
    largeImage: {
        width: 224, // Twice the width of normal images
        height: 222, // Twice the height of normal images
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ArtForYou2;
