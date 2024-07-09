import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DiscoverButton from '../DiscoverButton'; // Adjust the path as needed
import { useNavigation } from '@react-navigation/native';

const imagePaths = [
    { path: require('../../assets/art/art5.png'), artistName: 'Marco Marco', artTitle: 'Self Love', artYear: '2024', artDescription: 'Do it your way, love yourself', artType: 'Digital' },
    { path: require('../../assets/art/art2.png'), artistName: '@Artist2', artTitle: 'Title2', artYear: '2020', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/batman.png'), artistName: '@BruceWayne', artTitle: 'Title3', artYear: '2019', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/art3.png'), artistName: '@Artist3', artTitle: 'Title4', artYear: '2018', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/art4.png'), artistName: '@Artist4', artTitle: 'Title5', artYear: '2017', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/art1.jpg'), artistName: '@Artist5', artTitle: 'Title6', artYear: '2016', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/art6.png'), artistName: '@Artist6', artTitle: 'Title7', artYear: '2015', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/mountain.jpg'), artistName: '@Artist7', artTitle: 'Title8', artYear: '2014', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/grass.jpg'), artistName: '@Artist8', artTitle: 'Title9', artYear: '2013', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/building.jpg'), artistName: '@Artist9', artTitle: 'Title10', artYear: '2012', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/man.jpg'), artistName: '@Artist10', artTitle: 'Title11', artYear: '2011', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/hand.jpg'), artistName: '@Artist11', artTitle: 'Title12', artYear: '2010', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/gray.jpg'), artistName: '@Artist12', artTitle: 'Title13', artYear: '2009', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/path.jpg'), artistName: '@Artist13', artTitle: 'Title14', artYear: '2008', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/animal.jpg'), artistName: '@Artist14', artTitle: 'Title15', artYear: '2007', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/photos/sunset.jpg'), artistName: '@Artist15', artTitle: 'Title16', artYear: '2006', artDescription: 'desc 2', artType: 'Digital'},
    { path: require('../../assets/photos/deer.jpg'), artistName: '@Artist16', artTitle: 'Title17', artYear: '2005', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/superman.png'), artistName: '@Clark Kent', artTitle: 'Title18', artYear: '2004', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/spiderman.png'), artistName: '@PeterParker', artTitle: 'Title19', artYear: '2003', artDescription: 'desc 2', artType: 'Digital' },
    { path: require('../../assets/art/tajmahal.png'), artistName: '@NavjotKaur', artTitle: 'Title20', artYear: '2002', artDescription: 'desc 2', artType: 'Digital' },
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

    const handleImagePress = (image, artistName, artTitle, artYear, artDescription, artType, imageIndex) => {
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
                        <View style={styles.largeImageContainer}>
                            <Pressable onPress={() => handleImagePress(images[0].path, images[0].artistName, images[0].artTitle, images[0].artYear, images[0].artDescription, images[0].artType )}>
                                <Image
                                    source={images[0].path} // Access the image path from the object
                                    style={styles.largeImage}
                                />
                            </Pressable>
                            <Text style={styles.artistName}>{images[0].artistName}</Text>
                        </View>

                        {/* Render smaller images in subsequent sections */}
                        {imageChunks.slice(1).map((chunk, chunkIndex) => (
                            <View key={chunkIndex} style={styles.column}>
                                {chunk.map((path, index) => (
                                    <View key={index}>
                                        <Pressable onPress={() => handleImagePress(path.path, path.artistName, path.artTitle, path.artYear, path.artDescription, path.artType, chunkIndex * 2 + index + 1)}>
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
    largeImageContainer: {
        marginRight: 4, // Margin between large image and subsequent images
    },
    largeImage: {
        width: 264, // Twice the width of normal images
        height: 264, // Twice the height of normal images
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
