import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Animated, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TVButton from '../TVButton';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';

const headerImage = require('../../assets/headers/Art_for_you.png'); // Import the header image
const slideLeftGif = require('../../assets/slideLeft.gif'); // Import the sliding GIF

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
    const [artData, setArtData] = useState([]); // State to store the fetched data
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const inactivityTimeoutRef = useRef(null);

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
                setArtData(data.images); // Store the fetched data in state
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
        console.log('Resetting inactivity timer'); // Debugging output

        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        setOverlayVisible(false);

        inactivityTimeoutRef.current = setTimeout(() => {
            console.log('No activity detected for 5 seconds. Showing overlay.'); // Debugging output
            setOverlayVisible(true);
            fadeInOverlay();
        }, 5000); // Show the overlay after 5 seconds of inactivity
    };

    const fadeInOverlay = () => {
        console.log('Fading in overlay'); // Debugging output
        Animated.timing(fadeAnim, {
            toValue: 1, // Fade in to full opacity
            duration: 500, // Fade in duration
            useNativeDriver: true,
        }).start();
    };

    const fadeOutOverlay = () => {
        console.log('Fading out overlay'); // Debugging output
        Animated.timing(fadeAnim, {
            toValue: 0, // Fade out to zero opacity
            duration: 500, // Fade out duration
            useNativeDriver: true,
        }).start(() => {
            setOverlayVisible(false); // Hide after fade out
        });
    };

    const handleUserActivity = () => {
        console.log('User activity detected'); // Debugging output
        resetInactivityTimer();
        fadeOutOverlay(); // Immediately fade out when user interacts
    };

    const handleImagePress = (imageIndex) => {
        navigation.navigate('ImageScreen', { images: artData, initialIndex: imageIndex });
    };

    // If the artData hasn't been fetched yet, show a loading indicator
    if (artData.length === 0) {
        return <Text>Loading...</Text>;
    }

    const imageChunks = chunkArray(artData, 2); // Chunk the fetched data into groups of 2

    return (
        <TouchableWithoutFeedback onPress={handleUserActivity}>
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
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={handleUserActivity}
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
                                        <Text style={styles.artistName}>{art.name}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    {isOverlayVisible && (
                        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                            <View style={styles.card}>
                                <Image source={slideLeftGif} style={styles.cardImage} />
                                <Text style={styles.cardText}>Browse More</Text>
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
        marginTop: 10,
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        alignSelf: 'flex-start',
        paddingHorizontal: 5,
    },
    headerImage: {
        width: 264,
        height: 52,
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
        position: 'relative',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 4,
    },
    image: {
        width: 130,
        height: 130,
        marginBottom: 4,
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
        bottom: 10,
        right: -5, // Align the overlay to the right
        width: '60%',  // Adjust the width as needed
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end', // Align the card content to the right
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
});

export default ArtForYou;
