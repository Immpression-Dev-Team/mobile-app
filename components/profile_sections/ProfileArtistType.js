import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getArtistType } from '../../API/API';
import { useAuth } from '../../state/AuthProvider';

const ProfileArtistType = () => {
    const { userData } = useAuth();
    const token = userData?.token;
    const [artistType, setArtistType] = useState(null);

    useEffect(() => {
        const fetchArtistType = async () => {
            if (!token) return;
            try {
                const response = await getArtistType(token);
                if (response && response.success) {
                    setArtistType(response.artistType);
                } else {
                    console.error('Failed to fetch artist type:', response.error);
                }
            } catch (error) {
                console.error('Error fetching artist type:', error);
            }
        };

        fetchArtistType();
    }, [token]);

    return (
        <View style={styles.container}>
            <Text style={styles.artistTypeText}>
                {artistType || 'No artist type selected.'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
    },
    artistTypeText: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
});

export default ProfileArtistType;
