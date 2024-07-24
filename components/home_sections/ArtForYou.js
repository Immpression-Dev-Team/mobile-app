import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DiscoverButton from '../DiscoverButton'; // Adjust the path as needed
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
    const [images, setImages] = useState([...imagePaths]);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const inactivityTimeoutRef = useRef(null);
    const navigation = useNavigation();

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

    const handleImagePress = (imageIndex) => {
        navigation.navigate('ImageScreen', { images, initialIndex: imageIndex });
    };

    return (
        <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <Pressable
                    style={styles.rightHeader}
                    onPress={() => setIsAutoScrolling((prev) => !prev)}
                >
                    <DiscoverButton onPress={() => setIsAutoScrolling((prev) => !prev)} isAutoScrolling={isAutoScrolling} />
                </Pressable>
            </View>
            <View style={styles.allImageContainer}>
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
                        {/* Render smaller images in columns */}
                        {imageChunks.map((chunk, chunkIndex) => (
                            <View key={chunkIndex} style={styles.column}>
                                {chunk.map((path, index) => (
                                    <View key={index}>
                                        <Pressable onPress={() => handleImagePress(chunkIndex * 2 + index)}>
                                            <Image
                                                source={path.path}
                                                style={styles.image}
                                            />
                                        </Pressable>
                                        <Text style={styles.artistName}>{path.artistName}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </Pressable>
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
        marginBottom: 2,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
        paddingHorizontal: 10,
    },
    headerImage: {
        width: 264, // Adjust width according to your image
        height: 61, // Adjust height according to your image
        resizeMode: 'contain',
    },
    allImageContainer: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 5,
        padding: 5,
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