import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ArtistsPickHeader from '../../assets/headers/Artists_pick.png'; // Import the header image
import DiscoverButton from '../DiscoverButton'; // Import the DiscoverButton component

// Import the background image
import backgroundImage from '../../assets/backgrounds/discover_artists_background.png'; // Replace with your actual image path

// const imagePaths = [
//     { path: require('../../assets/photos/path.jpg'), title: 'Path', artist: 'Artist 1', profilePic: require('../assets/artists/artist5.png') },
//     { path: require('../../assets/photos/animal.jpg'), title: 'Animal', artist: 'Artist 2', profilePic: require('../assets/artists/artist4.jpeg') },
//     { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Artist 3', profilePic: require('../assets/artists/artist3.jpeg') },
//     { path: require('../../assets/photos/deer.jpg'), title: 'Deer', artist: 'Artist 4', profilePic: require('../assets/artists/artist1.jpeg') },
//     { path: require('../../assets/art/art1.jpg'), title: 'Art 1', artist: 'Artist 5', profilePic: require('../assets/artists/artist2.jpeg') },
//     { path: require('../../assets/art/art2.png'), title: 'Art 2', artist: 'Artist 6', profilePic: require('../assets/artists/artist6.jpeg') },
//     { path: require('../../assets/art/art3.png'), title: 'Art 3', artist: 'Artist 7', profilePic: require('../assets/artists/artist7.jpeg') },
//     { path: require('../../assets/art/art4.png'), title: 'Art 4', artist: 'Artist 8', profilePic: require('../assets/artists/artist8.jpeg') },
//     { path: require('../../assets/art/art5.png'), title: 'Art 5', artist: 'Artist 9', profilePic: require('../assets/artists/artist9.jpeg') },
//     { path: require('../../assets/art/art6.png'), title: 'Art 6', artist: 'Artist 10', profilePic: require('../assets/artists/artist10.jpeg') },
//     { path: require('../../assets/photos/building.jpg'), title: 'Building', artist: 'Artist 11', profilePic: require('../assets/artists/artist11.jpeg') },
//     { path: require('../../assets/photos/man.jpg'), title: 'Man', artist: 'Artist 12', profilePic: require('../assets/artists/artist12.jpeg') },
//     { path: require('../../assets/photos/hand.jpg'), title: 'Hand', artist: 'Artist 13', profilePic: require('../assets/artists/artist13.jpeg') },
//     { path: require('../../assets/photos/gray.jpg'), title: 'Gray', artist: 'Artist 14', profilePic: require('../assets/artists/artist14.jpeg') },
//     // Add more images and profile pictures if needed
// ];

const ArtistsPick = () => {
    return (
        <View style={styles.cardContainer}>
            <ImageBackground source={backgroundImage} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
                <LinearGradient colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)']} style={styles.gradient}>
                    <View style={styles.section}>
                        <View style={styles.headerContainer}>
                            <Image source={ArtistsPickHeader} style={styles.headerImage} />
                            <View style={styles.rightHeader}>
                                <DiscoverButton />
                            </View>
                        </View>
                        <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                            {imagePaths.map((item, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <View style={styles.imageWrapper}>
                                        <Image source={item.path} style={styles.image} />
                                        <View style={styles.profilePicContainer}>
                                            <Image source={item.profilePic} style={styles.profilePic} />
                                        </View>
                                    </View>
                                    <Text style={styles.imageTitle}>{item.title}</Text>
                                    <Text style={styles.artistName}>{item.artist}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
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
        marginTop: 20,
    },
    backgroundImage: {
        width: '97%',
    },
    backgroundImageStyle: {
        resizeMode: 'cover',
        borderRadius: 0,
    },
    gradient: {
        flex: 1,
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        alignSelf: 'flex-start',
        paddingHorizontal: 7,
    },
    headerImage: {
        width: 200, // Adjust width according to your image
        height: 50, // Adjust height according to your image
        resizeMode: 'contain',
    },
    rightHeader: {
        marginLeft: 'auto',
        marginRight: 10,
    },
    scrollView: {
        flexDirection: 'row',
    },
    imageContainer: {
        marginRight: 4,
        alignItems: 'flex-start',
    },
    imageWrapper: {
        position: 'relative',
        width: 110,
        height: 110,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    profilePicContainer: {
        position: 'absolute',
        bottom: -20,
        right: 15,
        width: 55,
        height: 55,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#5D9177',
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    imageTitle: {
        marginTop: 20,
        marginLeft: 7,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    artistName: {
        marginLeft: 7,
        textAlign: 'left',
        color: 'gray',
    },
});

export default ArtistsPick;
