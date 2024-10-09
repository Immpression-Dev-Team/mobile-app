import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useAuth } from "../state/AuthProvider"; // Assuming you have an AuthProvider to get userData
import { uploadProfilePicture } from "../API/API"; // Your API function to update the user's profile picture on the backend
import { Platform } from "react-native";

const UploadProfilePicture = () => {
  const { userData } = useAuth();  // Retrieve userData from AuthProvider, including token
  const [image, setImage] = useState(null);

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
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ ...selectedImage, uri: resizedImage.uri });
    }
  };

  // Function to handle image upload to Cloudinary
  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image to upload");
      return;
    }

    const data = new FormData();

    try {
      if (Platform.OS === "web") {
        // Web-specific logic: Convert base64 to Blob for web uploads
        const base64String = image.uri.split(",")[1];
        const imageBlob = base64ToBlob(base64String, "image/jpeg");
        data.append("file", imageBlob, "profile_picture.jpg");
      } else {
        // Mobile-specific logic: Directly append image URI
        data.append("file", {
          uri: image.uri,
          name: `profile_picture_${userData.user.user._id}.jpg`,
          type: "image/jpeg",
        });
      }

      // Append other necessary data for Cloudinary
      data.append("upload_preset", "edevre"); // Your Cloudinary unsigned upload preset
      data.append("folder", "artists"); // Upload to the 'artists' folder in Cloudinary
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
        const deleteImage = async (publicId) => {
          const url = `https://api.cloudinary.com/v1_1/dttomxwev/image/destroy`;
        
          // FormData to send the public_id of the image
          const formData = new FormData();
          formData.append("public_id", publicId);
        
          try {
            const response = await fetch(url, {
              method: "POST", // Cloudinary destroy method uses POST, not DELETE
              body: formData,
            });
        
            const result = await response.json();
            console.log(result);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        };
        
        // Call the function with the image's public ID
        deleteImage(`profile_picture_${userData.user.user._id}.jpg`);        
        

        const profilePictureLink = result.secure_url;

        // After successful upload to Cloudinary, update backend with the profilePictureLink
        const imageData = {
          userId: userData.user.user._id,
          profilePictureLink: profilePictureLink,
        };

        const token = userData.token;
        await uploadProfilePicture(imageData, token); // API call to save profilePictureLink to backend

        setImage(null);
        Alert.alert("Success", "Profile picture DELETED successfully!");
      } else {
        Alert.alert("Error", result.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile Picture</Text>

      <TouchableOpacity style={styles.imagePlaceholder} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  imagePlaceholderText: {
    color: "#aaa",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UploadProfilePicture;
