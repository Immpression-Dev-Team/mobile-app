import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import the header images
import discoverHeader from '../../assets/headers/Discover.png';
import stageLight from '../../assets/headers/StageLight.png';

const imagePaths = [
    { path: require('../../assets/photos/path.jpg'), title: 'Path', artist: 'Artist 1', profilePic: require('../../assets/artists/artist5.png') },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', artist: 'Artist 2', profilePic: require('../../assets/artists/artist4.png') },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Artist 3', profilePic: require('../../assets/artists/artist3.png') },
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
    const imageChunks = chunkArray(imagePaths, 1); // Chunk into groups of 1 image

    return (
        <LinearGradient colors={['white', '#002d75', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={discoverHeader} style={styles.headerImage} />
            </View>
            <Image source={stageLight} style={styles.stageLight} />
            <ScrollView horizontal style={styles.scrollView}>
                {imageChunks.map((chunk, chunkIndex) => (
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((item, index) => (
                            <View key={index} style={styles.artistContainer}>
                                <Image
                                    source={item.profilePic}
                                    style={styles.image}
                                />
                                <Text style={styles.artistName}>{item.artist}</Text>
                            </View>
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
        // backgroundColor: '#0076F7',
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
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 10,
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
