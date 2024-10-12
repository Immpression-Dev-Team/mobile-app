import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { updateArtistType } from '../../API/API';
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
        width: '90%',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 4,
    },
    artistTypeText: {
        fontSize: 16,
        color: '#333',
    },
});

export default ProfileArtistType;
