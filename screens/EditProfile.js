import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getArtistType, updateArtistType, getBio, updateBio } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from './Template/ScreenTemplate';
import ProfilePic from '../components/profile_sections/ProfilePic'; // ✅ Reusing ProfilePic

const EditProfile = () => {
    const navigation = useNavigation();
    const { userData } = useAuth();
    const token = userData?.token;

    const [open, setOpen] = useState(false);
    const [artistType, setArtistType] = useState(null);
    const [items, setItems] = useState([
        { label: 'Painter', value: 'Painter' },
        { label: 'Graphic Designer', value: 'Graphic Designer' },
        { label: 'Photographer', value: 'Photographer' },
        { label: 'Sculptor', value: 'Sculptor' },
        { label: 'Illustrator', value: 'Illustrator' },
    ]);

    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) return;
            try {
                const artistResponse = await getArtistType(token);
                if (artistResponse?.success) setArtistType(artistResponse.artistType);

                const bioResponse = await getBio(token);
                if (bioResponse?.success) setBio(bioResponse.bio);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, [token]);

    const handleSaveProfile = async () => {
        if (!token) {
            Alert.alert('Error', 'You need to be logged in to update your profile.');
            return;
        }

        try {
            const artistResponse = await updateArtistType(artistType, token);
            if (!artistResponse?.success) {
                Alert.alert('Error', 'Failed to update artist type.');
                return;
            }

            const bioResponse = await updateBio(bio, token);
            if (!bioResponse?.success) {
                Alert.alert('Error', 'Failed to update bio.');
                return;
            }

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'An error occurred while updating your profile.');
        }
    };

    return (
        <ScreenTemplate>
            <View style={styles.container}>
                <Text style={styles.heading}>Edit Your Profile</Text>

                {/* ✅ Using ProfilePic with TouchableOpacity for Editing */}
                <TouchableOpacity onPress={() => Alert.alert('Change profile picture in ProfilePic component')}>
                    <ProfilePic />
                </TouchableOpacity>

                {/* Dropdown for Artist Type */}
                <Text style={styles.label}>Select Artist Type:</Text>
                <DropDownPicker
                    open={open}
                    value={artistType}
                    items={items}
                    setOpen={setOpen}
                    setValue={setArtistType}
                    setItems={setItems}
                    placeholder="Select your artist type"
                    style={styles.dropdown}
                />

                {/* Bio Input */}
                <Text style={styles.label}>Bio:</Text>
                <TextInput
                    style={styles.input}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Write something about yourself..."
                    multiline={true}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScreenTemplate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    dropdown: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 20,
        textAlignVertical: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EditProfile;
