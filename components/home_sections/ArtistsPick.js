import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const imagePaths = [
    { path: require('../../assets/photos/path.jpg'), title: 'Path', profilePic: require('../../assets/artists/artist5.png') },
    { path: require('../../assets/photos/animal.jpg'), title: 'Animal', profilePic: require('../../assets/artists/artist4.png') },
    { path: require('../../assets/photos/sunset.jpg'), title: 'Sunset', profilePic: require('../../assets/artists/artist3.png') },
    { path: require('../../assets/photos/deer.jpg'), title: 'Deer', profilePic: require('../../assets/artists/artist1.png') },
    { path: require('../../assets/art/art1.jpg'), title: 'Art 1', profilePic: require('../../assets/artists/artist2.png') },
    { path: require('../../assets/art/art2.png'), title: 'Art 2', profilePic: require('../../assets/artists/artist6.png') },
    { path: require('../../assets/art/art3.png'), title: 'Art 3', profilePic: require('../../assets/artists/artist7.png') },
    { path: require('../../assets/art/art4.png'), title: 'Art 4', profilePic: require('../../assets/artists/artist8.png') },
    { path: require('../../assets/art/art5.png'), title: 'Art 5', profilePic: require('../../assets/artists/artist9.png') },
    { path: require('../../assets/art/art6.png'), title: 'Art 6', profilePic: require('../../assets/artists/artist10.png') },
    { path: require('../../assets/photos/building.jpg'), title: 'Building', profilePic: require('../../assets/artists/artist11.png') },
    { path: require('../../assets/photos/man.jpg'), title: 'Man', profilePic: require('../../assets/artists/artist12.png') },
    { path: require('../../assets/photos/hand.jpg'), title: 'Hand', profilePic: require('../../assets/artists/artist13.png') },
    { path: require('../../assets/photos/gray.jpg'), title: 'Gray', profilePic: require('../../assets/artists/artist14.png') },
    // Add more images and profile pictures if needed
];

const ArtistsPick = () => {
    return (
        <View style={styles.section}>
            <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <Text style={styles.header}>Artist's Pick</Text>
                </View>
                <View style={styles.rightHeader}>
                    <Text style={styles.secondaryHeader}>More</Text>
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
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        alignSelf: 'flex-start',
    },
    leftHeader: {
        backgroundColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 2,
        borderTopLeftRadius: 10,
    },
    rightHeader: {
        backgroundColor: '#B7C9E2',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderTopRightRadius: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 158,
    },
    secondaryHeader: {
        fontSize: 15,
        color: 'black',
    },
    scrollView: {
        flexDirection: 'row',
    },
    imageContainer: {
        marginRight: 3,
        alignItems: 'left',
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
        bottom: -17,
        right: 15,
        width: 80,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
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
    },
});

export default ArtistsPick;
