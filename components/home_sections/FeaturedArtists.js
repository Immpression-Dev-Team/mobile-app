import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DiscoverButton from '../DiscoverButton';

// Remove the header image import since it's no longer needed
// import discoverHeader from '../../assets/headers/Discover.png';

const imagePaths = [
    { path: require('../../assets/photos/sunset.jpg'), type: 'Graphic Designer', artist: 'Marcus Morales', profilePic: require('../../assets/realArtists/Marcus_Morales.jpg'), bio: 'Bio for Marcus Morales' },
    { path: require('../../assets/photos/path.jpg'), type: 'Photographer', artist: 'Antoin Ramirez', profilePic: require('../../assets/realArtists/Antoin_Ramirez.jpeg'), bio: 'Testing 123' },
    { path: require('../../assets/photos/animal.jpg'), type: 'Painter', artist: 'Karla Maldonado', profilePic: require('../../assets/realArtists/Karla_Maldonado.jpeg'), bio: 'Bio for Karla Maldonado' },
    { path: require('../../assets/photos/sunset.jpg'), type: 'Painter', artist: 'Obba Sanyang', profilePic: require('../../assets/realArtists/Obba_Sanyang.jpeg'), bio: 'Bio for Obba Sanyang' },
    { path: require('../../assets/photos/sunset.jpg'), type: 'Graphic Designer', artist: 'Daniel Robinson', profilePic: require('../../assets/realArtists/Daniel_Robinson.jpg'), bio: 'Bio for Daniel Robinson' },
    { path: require('../../assets/photos/sunset.jpg'), type: 'Painter', artist: 'Kailani Estrada', profilePic: require('../../assets/realArtists/Kailani_Estrada.jpeg'), bio: 'Bio for Kailani Estrada' },
];

const FeaturedArtists = () => {
    const navigation = useNavigation();

    const navigateToArtistScreen = (artist, profilePic, initialIndex) => {
        navigation.navigate('ArtistScreens', { artist, profilePic, type, galleryImages: imagePaths, initialIndex });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Replace Image with Text */}
                <Text style={styles.headerText}>DISCOVER ARTISTS</Text>
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
                        <Text style={styles.artistType}>{item.type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
    headerContainer: {
        flexDirection: 'row',  // Align items in a row
        justifyContent: 'space-between',  // Space between header and button
        alignItems: 'center',
        marginBottom: 2,
        marginTop: 0,
    },
    headerText: {
        fontSize: 20,  // Set the font size for the header
        fontWeight: 'bold',  // Make the text bold
        color: '#000',  // Set the text color
    },
    scrollView: {
        flexDirection: 'row',
    },
    artistContainer: {
        alignItems: 'left',
        marginRight: 3,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 2,
    },
    artistName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'black',
    },
    artistType: {
        fontSize: 8,
        color: 'black',
    },
});

export default FeaturedArtists;
