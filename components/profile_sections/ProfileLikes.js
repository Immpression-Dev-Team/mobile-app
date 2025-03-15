import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileLikes = ({ likes }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/icons/likes_icon.png')} style={styles.icon} />
            <Text style={styles.likesCount}>{likes}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Icon and count displayed in a row
        alignItems: 'center',
        marginTop: 10,
        bottom: -20,
    },
    icon: {
        width: 16, // Adjust size as needed
        height: 16,
        marginRight: 3, // Spacing between icon and text
    },
    likesCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default ProfileLikes;
