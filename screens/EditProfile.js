import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getArtistType,
  updateArtistType,
  getBio,
  updateBio,
  getUserProfile,
  updateShippingZip,
} from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from './Template/ScreenTemplate';
import ProfilePic from '../components/profile_sections/ProfilePic';

const ZIP_REGEX = /^\d{5}(-\d{4})?$/; // 12345 or 12345-6789

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
  const [zipcode, setZipcode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return;
      try {
        // Load artist type
        const artistResponse = await getArtistType(token);
        if (artistResponse?.success) setArtistType(artistResponse.artistType);

        // Load bio
        const bioResponse = await getBio(token);
        if (bioResponse?.success) setBio(bioResponse.bio || '');

        // Load zipcode (from user profile)
        const profile = await getUserProfile(token);
        if (profile?.success && profile?.user?.zipcode) {
          setZipcode(String(profile.user.zipcode));
        }
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

    // Validate ZIP (optional, but recommended)
    if (zipcode && !ZIP_REGEX.test(zipcode.trim())) {
      Alert.alert('Invalid ZIP', 'Zip code must be 5 digits or ZIP+4 (e.g., 94107 or 94107-1234).');
      return;
    }

    try {
      setSaving(true);

      // Save in parallel
      const [artistResp, bioResp, zipResp] = await Promise.allSettled([
        updateArtistType(artistType, token),
        updateBio(bio, token),
        updateShippingZip(zipcode?.trim() || '', token),
      ]);

      const artistOk = artistResp.status === 'fulfilled' && artistResp.value?.success;
      const bioOk = bioResp.status === 'fulfilled' && bioResp.value?.success;
      const zipOk = zipResp.status === 'fulfilled' && (zipResp.value?.success || zipcode?.trim() === '');

      if (artistOk && bioOk && zipOk) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        const messages = [];
        if (!artistOk) messages.push('artist type');
        if (!bioOk) messages.push('bio');
        if (!zipOk) messages.push('ZIP');
        Alert.alert('Partial update', `Failed to update: ${messages.join(', ')}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Your Profile</Text>

        <TouchableOpacity onPress={() => { /* handled in component */ }}>
          <ProfilePic />
        </TouchableOpacity>

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
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={bio}
          onChangeText={setBio}
          placeholder="Write something about yourself..."
          multiline
        />

        {/* ✅ ZIP Code field */}
        <Text style={styles.label}>Ship-from ZIP Code (for shipping estimates):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 11368 or 11368-1234"
          keyboardType="number-pad"
          value={zipcode}
          onChangeText={(t) => setZipcode(t.replace(/[^\d-]/g, ''))}
          maxLength={10}
        />
        <Text style={styles.helperText}>
          Used to calculate label-only shipping cost for your buyers. You can change this anytime.
        </Text>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save'}</Text>
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
    marginBottom: 8,
    width: '100%',
  },
  dropdown: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    minHeight: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    width: '100%',
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditProfile;
