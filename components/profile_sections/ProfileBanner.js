import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const bannerImage = require('../../assets/banner/banner2.png'); // Replace with your banner image path

const ProfileBanner = () => {
    return (
        <View style={styles.banner}>
            <Image source={bannerImage} style={styles.bannerImage} resizeMode="cover" />
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200, // Adjust the height as needed
        zIndex: -1, // Ensure the banner is behind other content
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden', // Ensure the image respects border radius
    },
    bannerImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default ProfileBanner;
