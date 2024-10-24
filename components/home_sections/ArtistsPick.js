import React from 'react';
import { View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ArtistsPickHeader from '../../assets/headers/Artists_pick.png'; // Import the header image
import DiscoverButton from '../DiscoverButton'; // Import the DiscoverButton component
import styles from '../../styles/home/ArtistsPickStyles';
// Import the background image
import backgroundImage from '../../assets/backgrounds/discover_artists_background.png'; // Replace with your actual image path

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



export default ArtistsPick;
