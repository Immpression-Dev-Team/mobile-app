import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileViews = ({ views }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>Views: </Text>
            <Text style={styles.viewsCount}>{views}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row', // Display label and count horizontally
        backgroundColor: '#acaeb0',
        padding: 5,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        bottom: -110,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5, // Add spacing between label and count
    },
    viewsCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black', // Example color
    },
});

export default ProfileViews;
