import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const images = [
    require('../../assets/art/sketch1.png'),
    require('../../assets/art/photography1.png'),
    require('../../assets/art/sketch2.png'),
    require('../../assets/art/photography2.png'),
    require('../../assets/art/sketch3.png'),
    require('../../assets/art/photography3.png'),
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
        marginTop: 50,
        bottom: -100,
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
