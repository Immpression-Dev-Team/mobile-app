import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TVButton from '../TVButton';
import { useNavigation } from '@react-navigation/native';

const imagePaths = [
    { path: require('../../assets/realArt/IMG_7313.png'), artistName: 'Antoin Ramirez', artTitle: 'IMG_7313', artYear: '2024', artDescription: 'Do it your way, love yourself', artType: 'Digital' },
    { path: require('../../assets/realArt/IMG_5865.png'), artistName: 'Antoin Ramirez', artTitle: 'IMG_5865', artYear: '2020', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/EDS_ZEBRA.png'), artistName: 'Karla Maldonando', artTitle: 'EDS_ZEBRA', artYear: '2019', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/Opiods.png'), artistName: 'Karla Maldonando', artTitle: 'Opiods', artYear: '2018', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/Lasting_Impacts.png'), artistName: 'Karla Maldonando', artTitle: 'Lasting_Impacts', artYear: '2017', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/Melt.png'), artistName: 'Karla Maldonando', artTitle: 'Melt', artYear: '2016', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/IMG_7315.png'), artistName: 'Antoin Ramirez', artTitle: 'IMG-7315', artYear: '2015', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/IMG_7380.png'), artistName: 'Antoin Ramirez', artTitle: 'IMG_7380', artYear: '2014', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/IMG_7434.png'), artistName: 'Antoin Ramirez', artTitle: 'IMG_7434', artYear: '2013', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/realArt/8262E66E.jpeg'), artistName: 'Antoin Ramirez', artTitle: '8262E66E', artYear: '2012', artDescription: 'desc 2', artType: 'Digital' },
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
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0
    const navigation = useNavigation();
    const scrollDistance = 150; // Adjust this to set how much it scrolls to the right
    const imageChunks = chunkArray(imagePaths, 2); // Chunk into groups of 2 images

    useEffect(() => {
        const scrollTimeout = setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: scrollDistance,
                    animated: true,
                });

                setTimeout(() => {
                    scrollViewRef.current.scrollTo({
                        x: 0,
                        animated: true,
                    });
                }, 500); // Scroll back to the left after 0.5 seconds
            }
        }, 2000); // Start the scroll after 2 seconds

        return () => clearTimeout(scrollTimeout);
    }, [scrollDistance]);

    useEffect(() => {
        const fadeInOut = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1, // Fade in to full opacity
                    duration: 300, // 1 second
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0, // Fade out to zero opacity
                    duration: 2000, // 1 second
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const overlayTimeout = setTimeout(fadeInOut, 2000); // Start the fade in/out after 2 seconds

        return () => clearTimeout(overlayTimeout);
    }, [fadeAnim]);

    const handleImagePress = (imageIndex) => {
        navigation.navigate('ImageScreen', { images: imagePaths, initialIndex: imageIndex });
    };

    return (
        <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <Pressable style={styles.rightHeader}>
                    <TVButton />
                </Pressable>
            </View>
            <View style={styles.allImageContainer}>
                <ScrollView
                    horizontal
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false} // Disable horizontal scrollbar
                    scrollEventThrottle={16}
                >
                    {/* Render smaller images in columns */}
                    {imageChunks.map((chunk, chunkIndex) => (
                        <View key={chunkIndex} style={styles.column}>
                            {chunk.map((path, index) => (
                                <View key={index}>
                                    <Pressable onPress={() => handleImagePress(chunkIndex * 2 + index)}>
                                        <Image source={path.path} style={styles.image} />
                                    </Pressable>
                                    <Text style={styles.artistName}>{path.artistName}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>

                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <Text style={styles.overlayText}>Browse</Text>
                    <Text style={styles.arrow}>→</Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center items
        marginBottom: 0,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
        paddingHorizontal: 5,
    },
    headerImage: {
        width: 264, // Adjust width according to your image
        height: 52, // Adjust height according to your image
        resizeMode: 'contain',
    },
    allImageContainer: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 5,
        paddingTop: 0,
        padding: 5,
        position: 'relative', // Ensure proper positioning of the overlay
    },
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
    artistName: {
        fontSize: 10,
        marginLeft: 2,
        bottom: 4,
        position: 'absolute',
        zIndex: 99,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '30%', // Adjust this percentage to control how much of the right side is covered
        height: '99%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 5, // Space between "Browse" and the arrow
    },
    arrow: {
        color: 'white',
        fontSize: 24,
    },
});

export default ArtForYou;
