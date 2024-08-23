import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DiscoverButton from '../DiscoverButton';

import discoverHeader from '../../assets/headers/Discover.png';
import backgroundImage from '../../assets/backgrounds/discover_artists_background.png';

const imagePaths = [
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Marcus Morales', profilePic: require('../../assets/realArtists/Marcus_Morales.jpg'), bio: 'Bio for Marcus Morales' },
    { path: require('../../assets/photos/path.jpg'), title: 'Path', artist: 'Antoin Ramirez', profilePic: require('../../assets/realArtists/Antoin_Ramirez.jpeg'), bio: 'Testing 123' },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', artist: 'Karla Maldonado', profilePic: require('../../assets/realArtists/Karla_Maldonado.jpeg'), bio: 'Bio for Karla Maldonado' },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Obba Sanyang', profilePic: require('../../assets/realArtists/Obba_Sanyang.jpeg'), bio: 'Bio for Obba Sanyang' },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Daniel Robinson', profilePic: require('../../assets/realArtists/Daniel_Robinson.jpg'), bio: 'Bio for Daniel Robinson' },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', artist: 'Kailani Estrada', profilePic: require('../../assets/realArtists/Kailani_Estrada.jpeg'), bio: 'Bio for Kailani Estrada' },
];

const FeaturedArtists = () => {
    const navigation = useNavigation();

    const navigateToArtistScreen = (artist, profilePic, initialIndex) => {
        navigation.navigate('ArtistScreens', { artist, profilePic, galleryImages: imagePaths, initialIndex });
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
                        {imagePaths.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.artistContainer}
                                onPress={() => navigateToArtistScreen(item.artist, item.profilePic, index)}
                            >
                                <Image source={item.profilePic} style={styles.image} />
                                <Text style={styles.artistName}>{item.artist}</Text>
                            </TouchableOpacity>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        alignSelf: 'flex-start',
        paddingHorizontal: 0,
    },
    headerImage: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
        marginRight: 27,
    },
    scrollView: {
        flexDirection: 'row',
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
        borderRadius: 0,
        marginRight: 4,
    },
    artistName: {
        fontSize: 11,
        marginTop: 5,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default FeaturedArtists;
