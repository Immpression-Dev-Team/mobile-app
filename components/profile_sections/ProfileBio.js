import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { updateBio, getBio } from '../../API/API';
import { useAuth } from '../../state/AuthProvider'; // Import the useAuth hook
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

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
          <Text style={styles.bioText}>{bio || 'No bio available. Add a bio!'}</Text>
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
    width: '100%',
    padding: 10,
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
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',  // Center contents horizontally
    width: '100%',  // Ensure full width is used
  },
  bioText: {
    fontSize: 16,
    textAlign: "center",  // Center text
    color: '#333',
  },
  editButton: {
    padding: 2,  // Give some padding to make the icon touchable
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
