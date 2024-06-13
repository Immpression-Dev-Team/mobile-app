import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileBanner from '../components/profile_sections/ProfileBanner';

const Profile = () => {
    const profilePicSource = require('../assets/artists/artist1.png'); // Use require to import the local image
    const profileName = "John Doe"; // Replace with the actual profile name

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Navbar />
            <View style={styles.profileContainer}>
                <ProfileBanner />
                <ProfilePic source={profilePicSource} />
                <ProfileName name={profileName} />
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
        marginTop: 10, // Add some space below the Navbar
    },
    galleryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
});

export default Profile;
