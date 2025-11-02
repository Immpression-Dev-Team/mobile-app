import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../../state/AuthProvider';
import { uploadProfilePicture, fetchProfilePicture, deleteProfilePicture, updateProfilePicture } from '../../API/API';

const ProfilePic = ({ source, name }) => {
  const { userData } = useAuth();
  const [image, setImage] = useState(null);

  const loadProfilePicture = async () => {
    try {
      const response = await fetchProfilePicture(userData.user.user._id);
      if (response?.profilePictureLink) {
        setImage({ uri: response.profilePictureLink });
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    const isOwnProfile = name === userData.user.user.name;

    if (source?.uri && !isOwnProfile) {
      setImage(source); // another user's profile
    } else if (isOwnProfile) {
      loadProfilePicture(); // your own profile
    } else {
      setImage(null); // fallback
    }
  }, [source, name]);

  const selectImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 512, height: 512 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ uri: resizedImage.uri });
      handleUpload(resizedImage.uri);
    }
  };

  const handleUpload = async (uri) => {
    const data = new FormData();
    const publicID = `profile_picture_${userData.user.user._id}`;

    try {
      if (Platform.OS === 'web') {
        const base64String = uri.split(',')[1];
        const imageBlob = base64ToBlob(base64String, 'image/jpeg');
        data.append('file', imageBlob, 'profile_picture.jpg');
      } else {
        data.append('file', {
          uri,
          name: `profile_picture_${userData.user.user._id}.jpg`,
          type: 'image/jpeg',
        });
      }

      data.append('upload_preset', 'edevre');
      data.append('folder', 'artists');
      data.append('public_id', publicID);

      await deleteProfilePicture(publicID);

      const response = await fetch('https://api.cloudinary.com/v1_1/dttomxwev/image/upload', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (!result.secure_url) throw new Error(result.error?.message || 'Upload failed');

      await uploadProfilePicture({ userId: userData.user.user._id, profilePictureLink: result.secure_url }, userData.token);
      Alert.alert('Success', 'Profile picture updated successfully!');
    // might not need this but need to test it
    //   await loadProfilePicture();
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', error.message || 'Upload failed');
    }
  };

  const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <View>
      <TouchableOpacity onPress={selectImage}>
        <Image
          source={image ? { uri: image.uri } : require('../../assets/defaultProfile.jpeg')}
          style={styles.profilePicture}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'white',
  },
});

export default ProfilePic;
