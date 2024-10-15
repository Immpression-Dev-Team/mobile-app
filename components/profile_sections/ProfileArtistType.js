import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getArtistType, updateArtistType } from '../../API/API'; // Import the getArtistType function
import { useAuth } from '../../state/AuthProvider';

const ProfileArtistType = () => {
    const { userData } = useAuth();
    const token = userData?.token;
    const [artistType, setArtistType] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Painter', value: 'Painter' },
        { label: 'Graphic Designer', value: 'Graphic Designer' },
        { label: 'Photographer', value: 'Photographer' },
        { label: 'Sculptor', value: 'Sculptor' },
        { label: 'Illustrator', value: 'Illustrator' },
    ]);

    useEffect(() => {
        // Fetch the artist type when the component mounts
        const fetchArtistType = async () => {
            if (!token) return; // Exit if there's no token

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

    const handleSaveArtistType = async () => {
        if (!token) {
            Alert.alert('Error', 'You need to be logged in to update your artist type.');
            return;
        }

        try {
            const response = await updateArtistType(artistType, token);
            if (response && response.success) {
                Alert.alert('Success', 'Artist type updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update artist type.');
            }
        } catch (error) {
            console.error('Error updating artist type:', error);
            Alert.alert('Error', 'An error occurred while updating the artist type.');
        }
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Artist Type</Text>
            {isEditing ? (
                <View>
                    <DropDownPicker
                        open={open}
                        value={artistType}
                        items={items}
                        setOpen={setOpen}
                        setValue={setArtistType}
                        setItems={setItems}
                        placeholder="Select your artist type"
                        style={styles.dropdown}
                        listMode="SCROLLVIEW"
                        dropDownContainerStyle={{
                            maxHeight: 150,
                        }}
                    />
                    <Button title="Save Artist Type" onPress={handleSaveArtistType} />
                </View>
            ) : (
                <View>
                    <Text style={styles.artistTypeText}>
                        {artistType || 'No artist type selected. Set your artist type!'}
                    </Text>
                    <Button title="Edit Artist Type" onPress={() => setIsEditing(true)} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '85%',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
    },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 4,
        paddingVertical: 5,
    },
    artistTypeText: {
        fontSize: 14,
        color: '#333',
        textAlign: "center",
        marginBottom: 6,
    },
    buttonContainer: {
        width: '80%', // Button width set to 80% of the container width
        marginTop: 8,
    },
    button: {
        backgroundColor: '#3498db', // Button background color
        paddingVertical: 8, // Adjusted vertical padding
        paddingHorizontal: 12, // Adjusted horizontal padding for a smaller button
        borderRadius: 4, // Rounded corners for a better look
    },
    buttonText: {
        fontSize: 14, // Slightly smaller font size for a more proportional button
        color: '#fff', // White text color for contrast
        textAlign: 'center',
    },
});


export default ProfileArtistType;
