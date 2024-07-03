import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';

const LogoTitle = () => {
    return (
        <View>
            <Image source={require('../assets/headers/Immpression_multi.png')} style={styles.title} />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        width: 100, // Adjust width as needed
        height: 40, // Adjust height as needed
        resizeMode: 'contain', // Adjust image resizing mode as needed
        marginLeft: 2.5,
    },
});

export default LogoTitle;
