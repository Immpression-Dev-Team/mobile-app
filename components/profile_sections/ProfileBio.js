import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { updateBio, getBio } from '../../API/API';
import { useAuth } from '../../state/AuthProvider'; // Import the useAuth hook
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { marginBottom } from '../../styles/helper';

const ProfileBio = () => {
  const { userData } = useAuth();  // Use the useAuth hook to get user data
  const token = userData?.token;   // Get the token from userData
  const [bio, setBio] = useState(''); // State to hold the bio text
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  useEffect(() => {
    const fetchBio = async () => {
      if (token) {
        try {
          const response = await getBio(token); // Fetch the bio from the server
          if (response && response.success) {
            setBio(response.bio); // Set the bio in the state
          } else {
            Alert.alert('Error', 'Failed to fetch bio.');
          }
        } catch (error) {
          console.error('Error fetching bio:', error);
          Alert.alert('Error', 'An error occurred while fetching the bio.');
        }
      }
    };

    fetchBio();
  }, [token]);

  const handleSaveBio = async () => {
    if (!token) {
      Alert.alert('Error', 'You need to be logged in to update your bio.');
      return;
    }

    try {
      const response = await updateBio(bio, token);
      if (response && response.success) {
        Alert.alert('Success', 'Bio updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update bio.');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      Alert.alert('Error', 'An error occurred while updating the bio.');
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveBio}>
            <Text style={styles.saveButtonText}>Save Bio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bioContainer}>
          <View style={styles.bioTextContainer}>
            <Text style={styles.bioText}>{bio || 'No bio available. Add a bio!'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
    borderRadius: 8,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',  // Make sure the input takes full width available (relative to its container)
    maxWidth: '80%',  // Ensure it doesn't stretch beyond the container
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: marginBottom(),
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    multiline: true, // This is necessary to wrap text
  },
  bioContainer: {
    flexDirection: 'row',  // Ensure items are placed in a row
    alignItems: 'center',  // Center the text vertically
    justifyContent: 'center',  // Center content horizontally
    width: '100%',
    position: 'relative',  // Make the edit button position relative to this container
  },
  bioTextContainer: {
    flex: 1,  // Take up remaining space for text
    alignItems: 'center',  // Center text in the middle of the container
  },
  bioText: {
    fontSize: 16,
    textAlign: 'center',  // Center the text inside its container
    color: '#333',
  },
  editButton: {
    position: 'absolute',  // Position the edit button absolutely
    right: 0,  // Align it to the right edge
    padding: 4,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileBio;
