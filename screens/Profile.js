import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

const Profile = () => {
    return (
        <View style={styles.container}>
            <Navbar />
            <Image 
                source={{ uri: 'https://example.com/your-profile-picture.jpg' }} // Replace with your profile picture URL
                style={styles.profilePicture}
            />
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
