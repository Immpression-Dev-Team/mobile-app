import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, } from 'react-native';

const ProfilePic = ({ source }) => {
    return (
        <Image
            source={source} // Use the source prop directly
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
