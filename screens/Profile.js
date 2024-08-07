import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileBanner from '../components/profile_sections/ProfileBanner';
import ProfileViews from '../components/profile_sections/ProfileViews';
import FooterNavbar from '../components/FooterNavbar';

const Profile = () => {
    const profilePicSource = require('../assets/artists/flight.png'); // Use require to import the local image
    const profileName = "Kimani White"; // Replace with the actual profile name
    const viewsCount = 394; // Example views count, replace with actual data

    return (
        <View style={styles.everything}>
            <ScrollView contentContainerStyle={styles.container}>
                <Navbar />
                <View style={styles.profileContainer}>
                    <ProfileBanner />
                    <ProfilePic source={profilePicSource} />
                    <ProfileName name={profileName} />
                    <ProfileViews views={viewsCount} />
                </View>
                <View style={styles.galleryContainer}>
                    <ProfileGallery />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <FooterNavbar />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    everything: {
        flex: 1,
    },
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
        marginTop: 0,
    },
    footer: {
        zIndex: 1000,
    },
});

export default Profile;
