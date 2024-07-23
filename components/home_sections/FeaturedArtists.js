import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Import the header images
import discoverHeader from '../../assets/headers/Discover.png';
import stageLight from '../../assets/headers/StageLight.png';

// Import ArtistScreen
import ArtistScreen from '../ArtistScreens';

const imagePaths = [
    { path: require('../../assets/photos/path.jpg'), title: 'Path', artist: 'Antoin Ramirez', profilePic: require('../../assets/realArtists/Antoin_Ramirez.jpeg') },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', artist: 'Karla Maldonado', profilePic: require('../../assets/realArtists/Karla_Maldonado.jpeg') },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Obba Sanyang', profilePic: require('../../assets/realArtists/Obba_Sanyang.jpeg') },
    { path: require('../../assets/photos/deer.jpg'), title: 'Deer', artist: 'Artist 4', profilePic: require('../../assets/artists/artist1.png') },
    { path: require('../../assets/art/art1.jpg'), title: 'Art 1', artist: 'Artist 5', profilePic: require('../../assets/artists/artist2.png') },
    { path: require('../../assets/art/art2.png'), title: 'Art 2', artist: 'Artist 6', profilePic: require('../../assets/artists/artist6.png') },
    { path: require('../../assets/art/art3.png'), title: 'Art 3', artist: 'Artist 7', profilePic: require('../../assets/artists/artist7.png') },
    { path: require('../../assets/art/art4.png'), title: 'Art 4', artist: 'Artist 8', profilePic: require('../../assets/artists/artist8.png') },
    { path: require('../../assets/art/art5.png'), title: 'Art 5', artist: 'Artist 9', profilePic: require('../../assets/artists/artist9.png') },
    { path: require('../../assets/art/art6.png'), title: 'Art 6', artist: 'Artist 10', profilePic: require('../../assets/artists/artist10.png') },
    { path: require('../../assets/photos/building.jpg'), title: 'Building', artist: 'Artist 11', profilePic: require('../../assets/artists/artist11.png') },
    { path: require('../../assets/photos/man.jpg'), title: 'Man', artist: 'Artist 12', profilePic: require('../../assets/artists/artist12.png') },
    { path: require('../../assets/photos/hand.jpg'), title: 'Hand', artist: 'Artist 13', profilePic: require('../../assets/artists/artist13.png') },
    { path: require('../../assets/photos/gray.jpg'), title: 'Gray', artist: 'Artist 14', profilePic: require('../../assets/artists/artist14.png') },
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
        <LinearGradient colors={['white', 'white', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={discoverHeader} style={styles.headerImage} />
            </View>
            <ScrollView horizontal style={styles.scrollView}>
                {imageChunks.map((chunk, chunkIndex) => (
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.artistContainer}
                                onPress={() => navigateToArtistScreen(item.artist, item.profilePic, imagePaths, index)}
                            >
                                <Image source={item.profilePic} style={styles.image} />
                                <Text style={styles.artistName}>{item.artist}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    section: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 0,
        padding: 5,
        marginBottom: 20,
        paddingBottom: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    allImageContainer: {
        width: '97%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 5,
        padding: 5,
    },
    headerContainer: {
        borderRadius: 3,
        paddingVertical: 0,
        paddingHorizontal: 5,
        marginTop: 20,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    headerImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
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
        marginRight: 10,
    },
    artistContainer: {
        alignItems: 'center',
        marginBottom: 5,
        elevation: 5,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 2,
        borderRadius: 2,
    },
    artistName: {
        fontSize: 11,
        marginTop: 5,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default FeaturedArtists;
