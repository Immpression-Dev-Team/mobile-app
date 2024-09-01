import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Animated, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DiscoverButton from '../DiscoverButton';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import  { useFonts } from 'expo-font';


const slideLeftGif = require('../../assets/slideLeft.gif'); // Import the sliding GIF

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const ArtForYou = () => {
    const scrollViewRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0
    const navigation = useNavigation();
    const scrollDistance = 150; // Adjust this to set how much it scrolls to the right
    const [artData, setArtData] = useState([]); // State to store the fetched data
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [originalArtData, setOriginalArtData] = useState([]); // Store original data
    const inactivityTimeoutRef = useRef(null);
    
        const [isLoaded] = useFonts({
            "LEMON MILK Bold": require('../../assets/fonts/LEMONMILK-Bold.otf'),
        });

    useEffect(() => {
        fetchArtData(); // Fetch data from the database on mount
        startAutoScrollOnce(); // Start the autoscroll once on mount
        resetInactivityTimer();

        return () => {
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, []);

    const fetchArtData = async () => {
        try {
            // Fetch data from the /all_images endpoint
            const response = await fetch(`${API_URL}/all_images`);
            const data = await response.json();
            if (data.success) {
                const shuffledData = shuffleArray(data.images); // Shuffle the images once
                setOriginalArtData(shuffledData); // Store the shuffled data
                setArtData(shuffledData); // Store the shuffled data in state
            } else {
                console.error('Error fetching art data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching art data:', error);
        }
    };

    const startAutoScrollOnce = () => {
        setTimeout(() => {
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
        }, 2000); // Start the scroll after 2 seconds (only once)
    };

    const resetInactivityTimer = () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        setOverlayVisible(false);

        inactivityTimeoutRef.current = setTimeout(() => {
            setOverlayVisible(true);
            fadeInOverlay();
        }, 5000); // Show the overlay after 5 seconds of inactivity
    };

    const fadeInOverlay = () => {
        Animated.timing(fadeAnim, {
            toValue: 1, // Fade in to full opacity
            duration: 500, // Fade in duration
            useNativeDriver: true,
        }).start();
    };

    const fadeOutOverlay = () => {
        Animated.timing(fadeAnim, {
            toValue: 0, // Fade out to zero opacity
            duration: 500, // Fade out duration
            useNativeDriver: true,
        }).start(() => {
            setOverlayVisible(false); // Hide after fade out
        });
    };

    const handleUserActivity = () => {
        resetInactivityTimer();
        fadeOutOverlay(); // Immediately fade out when user interacts
    };

    const handleImagePress = (imageIndex) => {
        navigation.navigate('ImageScreen', { images: artData, initialIndex: imageIndex });
    };

    const handleScrollEnd = () => {
        // Append the original shuffled data to itself to create an infinite loop
        setArtData((prevData) => [...prevData, ...originalArtData]);
    };

    // If the artData hasn't been fetched yet, show gray squares as loading placeholders
    if (artData.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingSquare} />
                <View style={styles.loadingSquare} />
                <View style={styles.loadingSquare} />
                <View style={styles.loadingSquare} />
            </View>
        );
    }

    const imageChunks = chunkArray(artData, 2); // Chunk the fetched data into groups of 2

    return (
        <TouchableWithoutFeedback onPress={handleUserActivity}>
            <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.section}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>ART FOR YOU</Text>
                    <DiscoverButton />
                </View>
                <View style={styles.allImageContainer}>
                    <ScrollView
                        horizontal
                        ref={scrollViewRef}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={handleUserActivity}
                        onMomentumScrollEnd={handleScrollEnd} // Handle scroll end to trigger data repetition
                    >
                        {imageChunks.map((chunk, chunkIndex) => (
                            <View key={chunkIndex} style={styles.column}>
                                {chunk.map((art, index) => (
                                    <View key={index}>
                                        <Pressable onPress={() => handleImagePress(chunkIndex * 2 + index)}>
                                            <Image
                                                source={{ uri: `data:${art.imageData.contentType};base64,${art.imageData.data}` }}
                                                style={styles.image}
                                            />
                                        </Pressable>
                                    </View>
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
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 6,
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
        paddingHorizontal: 5,
    },
    headerText: {
        fontSize: 20,
        // fontWeight: 'bold',
        color: '#000',
        fontFamily: 'LEMON MILK Bold',
    },
    allImageContainer: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 5,
        paddingTop: 0,
        padding: 5,
        position: 'relative',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 4,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 4,
        borderRadius: 0,
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
        marginRight: 5,
    },
    loadingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    loadingSquare: {
        width: 100,
        height: 100,
        backgroundColor: '#d3d3d3', // Light gray color
        margin: 5,
        borderRadius: 5,
    },
});

export default ArtForYou;
