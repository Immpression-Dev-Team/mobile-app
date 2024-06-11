import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DiscoverButton from '../DiscoverButton';

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

const headerImage = require('../../assets/headers/Art_for_you.png'); // Import the header image

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const ArtForYou = () => {
    const scrollViewRef = useRef(null);
    const [images, setImages] = useState([...imagePaths]);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const inactivityTimeoutRef = useRef(null);

    const imageChunks = chunkArray(images, 2); // Chunk into groups of 2 images

    useEffect(() => {
        let autoScrollInterval;

        if (isAutoScrolling) {
            autoScrollInterval = setInterval(() => {
                setScrollPosition((prevPosition) => {
                    const screenWidth = Dimensions.get('window').width;
                    const newPosition = prevPosition + screenWidth / 60; // Adjust the speed as needed
                    scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
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
        <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <TouchableOpacity
                    style={styles.rightHeader}
                    onPress={() => setIsAutoScrolling((prev) => !prev)}
                >
                    <DiscoverButton onPress={() => setIsAutoScrolling((prev) => !prev)} isAutoScrolling={isAutoScrolling} />
                </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback onPressIn={handleUserInteraction}>
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
            </TouchableWithoutFeedback>
            <View style={styles.horizontalLine}></View>
        </LinearGradient >
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
        paddingHorizontal: 10,
    },
    headerImage: {
        width: 264, // Adjust width according to your image
        height: 61, // Adjust height according to your image
        resizeMode: 'contain',
        // backgroundColor: '#000',
    },
    // rightHeader: {
    //     backgroundColor: '#000',
    //     borderTopRightRadius: 10,
    //     marginTop: 26,
    //     marginLeft: 33,
    // },
    // secondaryHeader: {
    //     fontSize: 15,
    //     color: 'white',
    //     fontWeight: 'bold',
    //     marginTop: 3,
    //     paddingVertical: 3,
    //     paddingHorizontal: 8,

    // },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 4, // Margin between columns
    },
    image: {
        width: 130,
        height: 130,
        marginBottom: 4, // Margin between images in a column
        borderRadius: 0,
    },
    largeImageContainer: {
        marginRight: 4, // Margin between large image and subsequent images
    },
    largeImage: {
        width: 264, // Twice the width of normal images
        height: 264, // Twice the height of normal images
    },
    horizontalLine: {
        borderBottomColor: '#8a9ab5', // Match the middle color of the gradient
        borderBottomWidth: 2,
        marginTop: 10,
        marginHorizontal: 20, // Adjust the horizontal margin as needed
        borderRadius: 5, // Add some border radius for a nicer appearance
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

export default ArtForYou;
