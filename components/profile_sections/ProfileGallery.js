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
        <ScrollView contentContainerStyle={styles.galleryContainer}>
            {images.map((image, index) => (
                <Image key={index} source={image} style={styles.image} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    galleryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
});

export default ProfileGallery;
