import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileBanner from '../components/profile_sections/ProfileBanner';

const Profile = () => {
    const profilePicSource = require('../assets/artists/flight.png'); // Use require to import the local image
    const profileName = "Kimani White"; // Replace with the actual profile name
    const viewsCount = 394; // Example views count, replace with actual data

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Navbar />
            <View style={styles.profileContainer}>
                <ProfileBanner />
                <ProfilePic source={profilePicSource} />
                <ProfileName name={profileName} views={viewsCount} />
            </View>
            <View style={styles.galleryContainer}>
                <ProfileGallery />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 10,
        position: 'relative',
    },
    galleryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
});

export default Profile;
