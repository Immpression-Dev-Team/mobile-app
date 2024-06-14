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
        width: 110,
        height: 110,
        bottom: -110,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'white',
        marginTop: 0, // Adjust margin as needed
    },
});

export default ProfilePic;
