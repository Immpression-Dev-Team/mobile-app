import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DiscoverButton from '../DiscoverButton';

// Import the header images
import discoverHeader from '../../assets/headers/Discover.png';
import stageLight from '../../assets/headers/StageLight.png';

// Import ArtistScreen
import ArtistScreen from '../ArtistScreens';

// Import the background image
import backgroundImage from '../../assets/backgrounds/discover_artists_background.png'; // Replace with your actual image path

const imagePaths = [
    { path: require('../../assets/photos/path.jpg'), title: 'Path', artist: 'Antoin Ramirez', profilePic: require('../../assets/realArtists/Antoin_Ramirez.jpeg') },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', artist: 'Karla Maldonado', profilePic: require('../../assets/realArtists/Karla_Maldonado.jpeg') },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Obba Sanyang', profilePic: require('../../assets/realArtists/Obba_Sanyang.jpeg') },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'James Young', profilePic: require('../../assets/artists/artist15.png') },
    // Add more images and profile pictures if needed
];

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const FeaturedArtists = () => {
    const navigation = useNavigation();
    const imageChunks = chunkArray(imagePaths, 1); // Chunk into groups of 1 image

    const navigateToArtistScreen = (artist, profilePic, galleryImages, initialIndex) => {
        navigation.navigate('ArtistScreens', { artist, profilePic, galleryImages, initialIndex });
    };

    return (
        <View style={styles.cardContainer}>
            <ImageBackground source={backgroundImage} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
                <LinearGradient colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)']} style={styles.section}>
                    <View style={styles.headerContainer}>
                        <Image source={discoverHeader} style={styles.headerImage} />
                        <DiscoverButton />
                    </View>
                    <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                        {imageChunks.map((chunk, chunkIndex) => (
                            <View key={chunkIndex} style={styles.column}>
                                {chunk.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.artistContainer}
                                        onPress={() => navigateToArtistScreen(item.artist, item.profilePic, imagePaths, chunkIndex * 1 + index)}
                                    >
                                        <Image source={item.profilePic} style={styles.image} />
                                        <Text style={styles.artistName}>{item.artist}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 0,
        padding: 0,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 10,
        marginTop: 5,
    },
    backgroundImage: {
        width: '97%',
    },
    backgroundImageStyle: {
        resizeMode: 'cover',
        borderRadius: 0,
    },
    section: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 0,
        padding: 20,
        marginBottom: 0,
        paddingBottom: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    allImageContainer: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 5,
        padding: 5,
    },
    headerContainer: {
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center items
        marginBottom: 0,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
        paddingHorizontal: 0,
    },
    headerImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
        marginRight: 27,
    },
    stageLight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 400, // Adjust width as needed
        height: 400, // Adjust height as needed
        resizeMode: 'contain',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 4,
    },
    artistContainer: {
        alignItems: 'center',
        marginBottom: 5,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 2,
        borderRadius: 100,
    },
    artistName: {
        fontSize: 11,
        marginTop: 5,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default FeaturedArtists;
