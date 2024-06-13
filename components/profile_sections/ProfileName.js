import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ProfileName = ({ name }) => {
    return (
        <Text style={styles.profileName}>{name}</Text>
    );
};

const styles = StyleSheet.create({
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ProfileName;
