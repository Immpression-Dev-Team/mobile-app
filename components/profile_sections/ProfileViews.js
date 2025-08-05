import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileViews = ({ views }) => {
    return (
        // <View style={styles.container}>
        //     <Image source={require('../../assets/icons/views_icon.jpg')} style={styles.icon} />
        //     <Text style={styles.viewsCount}>{views}</Text>
        // </View>
        <View>
            <Text style={styles.viewsCount}>{views}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Display icon and views count horizontally
        alignItems: 'center',
        marginTop: 10,
        bottom: -20,
    },
    icon: {
        width: 16, // Adjust size as needed
        height: 16,
        marginRight: 3, // Spacing between icon and text
    },
    viewsCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 7,
    },
});

export default ProfileViews;
