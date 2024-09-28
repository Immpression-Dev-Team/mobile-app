import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useAuth } from "../../state/AuthProvider";
import { uploadProfilePicture, fetchProfilePicture } from "../../API/API"; // Add the fetchProfilePicture API
import { Platform } from "react-native";

const ProfilePic = () => {
  const { userData } = useAuth(); // Retrieve userData from AuthProvider, including token
  const [image, setImage] = useState(null); // Image state for profile picture

  // Function to fetch the user's profile picture on component mount
  const loadProfilePicture = async () => {
    try {
      const response = await fetchProfilePicture(userData.user.user._id);
      if (response && response.profilePictureLink) {
        setImage({ uri: response.profilePictureLink }); // Set the fetched image
      } else {
        console.log("No profile picture found.");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    // Fetch the profile picture when the component mounts
    loadProfilePicture();
  }, []);

  // Image picker function
  const selectImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1], // Ensure the image is square to maintain circular profile picture
      quality: 1,
      base64: false,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 512, height: 512 } }], // Resize image for optimal profile picture size
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ uri: resizedImage.uri }); // Update the local image state
      handleUpload(resizedImage.uri); // Upload the image to Cloudinary
    }
  };

  // Function to handle image upload to Cloudinary
  const handleUpload = async (uri) => {
    const data = new FormData();

    try {
      if (Platform.OS === "web") {
        const base64String = uri.split(",")[1];
        const imageBlob = base64ToBlob(base64String, "image/jpeg");
        data.append("file", imageBlob, "profile_picture.jpg");
      } else {
        data.append("file", {
          uri: uri,
          name: `profile_picture_${userData.user.user._id}.jpg`,
          type: "image/jpeg",
        });
      }

      data.append("upload_preset", "edevre"); // Cloudinary upload preset
      data.append("folder", "artists"); // Upload to 'artists' folder in Cloudinary
      data.append("public_id", `profile_picture_${userData.user.user._id}`);

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dttomxwev/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (result.secure_url) {
        const profilePictureLink = result.secure_url;

        const imageData = {
          userId: userData.user.user._id,
          profilePictureLink: profilePictureLink,
        };

        const token = userData.token;
        await uploadProfilePicture(imageData, token); // API call to save profilePictureLink to backend

        Alert.alert("Success", "Profile picture uploaded successfully!");
      } else {
        Alert.alert("Error", result.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={selectImage}>
        <Image source={image ? { uri: image.uri } : require('../../assets/defaultProfile.png')} style={styles.profilePicture} />
      </TouchableOpacity>
    </View>
  );
};

// Helper function to convert base64 to Blob (for web)
const base64ToBlob = (base64Data, contentType = "image/jpeg") => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55, // To make the image circular
    borderWidth: 3,
    borderColor: "white",
  },
});

export default ProfilePic;
