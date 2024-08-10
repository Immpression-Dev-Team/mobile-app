import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import DiscoverButton from '../DiscoverButton'; // Adjust the path as needed

const headerImage = require('../../assets/headers/Art_of_the_day.png'); // Import the header image

const ArtOfTheDay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <Pressable
                    style={styles.rightHeader}
                    onPress={() => setIsAutoScrolling((prev) => !prev)}
                >
                    <DiscoverButton />
                </Pressable>
            </View>
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/art/art5.png')} // Replace with your image path
                    style={styles.artImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.artTitle}>Self Love</Text>
                    <Text style={styles.artistName}>Marcus Morales</Text>
                    <Text style={styles.artPrice}>$55</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 50,
    },
    headerContainer: {
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center items
        marginBottom: 0,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
        paddingHorizontal: 0,
    },
    headerImage: {
        width: 264, // Adjust width according to your image
        height: 52, // Adjust height according to your image
        resizeMode: 'contain',
    },
    contentContainer: {
        flexDirection: 'row', // Align the image and text side by side
        alignItems: 'center',
        marginTop: 0,
    },
    artImage: {
        width: 150, // Adjust size as needed
        height: 150,
        borderRadius: 0,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    artTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    artistName: {
        fontSize: 16,
        color: '#888',
    },
    artPrice: {
        fontSize: 14
    }
});

export default ArtOfTheDay;
