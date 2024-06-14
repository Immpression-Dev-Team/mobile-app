import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileViews from './ProfileViews';

const ProfileName = ({ name, views }) => {
    return (
        <View>
            <Text style={styles.profileName}>{name}</Text>
            <ProfileViews views={views} />
        </View>
    );
};

const styles = StyleSheet.create({
    profileName: {
        fontSize: 24,
        bottom: -110,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
    },
});

export default ProfileName;
