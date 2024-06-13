import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ProfilePic = ({ uri }) => {
    return (
        <Image 
            source={{ uri }} 
            style={styles.profilePicture} 
        />
    );
};

const styles = StyleSheet.create({
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20, // Adjust margin as needed
    },
});

export default ProfilePic;
c