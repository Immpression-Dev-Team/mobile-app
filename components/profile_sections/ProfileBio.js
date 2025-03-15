import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getBio } from '../../API/API';
import { useAuth } from '../../state/AuthProvider';

const ProfileBio = () => {
    const { userData } = useAuth();
    const token = userData?.token;
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchBio = async () => {
            if (!token) return;
            try {
                const response = await getBio(token);
                if (response && response.success) {
                    setBio(response.bio);
                } else {
                    console.error('Failed to fetch bio:', response.error);
                }
            } catch (error) {
                console.error('Error fetching bio:', error);
            }
        };

        fetchBio();
    }, [token]);

    return (
        <View style={styles.container}>
            <Text style={styles.bioText}>
                {bio || 'No bio available.'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    bioText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default ProfileBio;
