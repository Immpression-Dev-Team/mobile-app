import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';

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

const ArtForYou = () => {
    const scrollViewRef = useRef(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const inactivityTimeoutRef = useRef(null);

    const imageChunks = chunkArray(imagePaths, 2); // Chunk into groups of 2 images

    useEffect(() => {
        let autoScrollInterval;

        if (isAutoScrolling) {
            autoScrollInterval = setInterval(() => {
                setScrollPosition((prevPosition) => {
                    const newPosition = prevPosition + 1;
                    scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
                    return newPosition;
                });
            }, 19); // Adjust the speed as needed
        }

        return () => clearInterval(autoScrollInterval);
    }, [isAutoScrolling]);

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
                <Text style={styles.header}>Art For You</Text>
            </View>
            <TouchableWithoutFeedback onPressIn={handleUserInteraction}>
                <ScrollView
                    horizontal
                    style={styles.scrollView}
                    ref={scrollViewRef}
                    scrollEventThrottle={16}
                    onScrollBeginDrag={handleUserInteraction}
                    onTouchStart={handleUserInteraction}
                >
                    {/* Render large image as its own component/section */}
                    <View style={styles.largeImageContainer}>
                        <Image
                            source={imagePaths[0]} // Assuming first image is the large one
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
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    headerContainer: {
        backgroundColor: '#007AFF',
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 50,
        marginBottom: 5,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
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
        marginBottom: 3, // Margin between images in a column
        borderRadius: 0,
    },
    largeImageContainer: {
        marginRight: 2, // Margin between large image and subsequent images
    },
    largeImage: {
        width: 224, // Twice the width of normal images
        height: 224, // Twice the height of normal images
    },
});

export default ArtForYou;
