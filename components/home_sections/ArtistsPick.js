import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import ArtistsPickHeader from '../../assets/headers/Artists_pick.png'; // Import the header image
import DiscoverButton from '../DiscoverButton';

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
        <View style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={ArtistsPickHeader} style={styles.headerImage} />
                <View style={styles.rightHeader}>
                    <DiscoverButton />
                </View>
            </View>
            <ScrollView horizontal style={styles.scrollView}>
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
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
        marginTop: 20,
        paddingHorizontal: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
    },
    headerImage: {
        width: 200, // Adjust width according to your image
        height: 50, // Adjust height according to your image
        resizeMode: 'contain',
    },
    // rightHeader: {
    //     backgroundColor: '#B7C9E2',
    //     paddingVertical: 10,
    //     paddingHorizontal: 17,
    //     borderTopRightRadius: 10,
    // },
    // secondaryHeader: {
    //     fontSize: 15,
    //     color: 'black',
    // },
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
        width: 80,
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white',
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
