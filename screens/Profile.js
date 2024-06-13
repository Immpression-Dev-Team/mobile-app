import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';
import ProfilePic from '../components/profile_sections/ProfilePic';

const Profile = () => {
    const profilePicUri = 'https://example.com/your-profile-picture.jpg'; // Replace with your profile picture URL

    return (
        <View style={styles.container}>
            <NavBar />
            <ProfilePic uri={profilePicUri} />
        </View>
    );
};

const styles = StyleSheet.create({
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20, // Space between the navbar and the profile picture
    },
});

export default Profile;
