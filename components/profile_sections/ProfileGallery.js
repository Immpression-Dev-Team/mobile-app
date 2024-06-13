import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const images = [
    require('../../assets/art/art1.jpg'),
    require('../../assets/art/art2.png'),
    require('../../assets/art/art3.png'),
    require('../../assets/art/art4.png'),
    require('../../assets/art/art5.png'),
];

const ProfileGallery = () => {
    return (
        <View style={styles.all}>
            <ScrollView contentContainerStyle={styles.galleryContainer}>
                {images.map((image, index) => (
                    <Image key={index} source={image} style={styles.image} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    all: {
        width: '100%',
        alignItems: 'center',
    },
    galleryContainer: {
        width: '100%', // Adjust this width to control the gallery width
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    image: {
        width: 125,
        height: 125,
        margin: 1,
    },
});

export default ProfileGallery;
