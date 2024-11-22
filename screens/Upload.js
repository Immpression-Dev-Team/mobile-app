import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import { useAuth } from "../state/AuthProvider";
import { uploadImage } from "../API/API";
import { Platform } from "react-native";
import LoadingSection from "../components/home_sections/SectionTemplate/LoadingSection";

const Upload = () => {
  const { userData } = useAuth(); // Retrieve userData from AuthProvider, including token
  // console.log(`id: ${userData?.user?.user?._id}`);  // Log user ID to verify

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Paintings", value: "paintings" },
    { label: "Photography", value: "photography" },
    { label: "Graphic Design", value: "graphic design" },
    { label: "Illustrations", value: "illustrations" },
    { label: "Sculptures", value: "sculptures" },
    { label: "Woodwork", value: "woodwork" },
    { label: "Graffiti", value: "graffiti" },
    { label: "Stencil", value: "stencil" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  /*
    clear form after uploaded image successfully
  */
  const resetForm = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
  };

  /*
    show error modal on screen when encounter any errors
  */
  const displayError = (message) => {
    console.log(`Error: ${message}`);
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Error", message);
    }
  };

  /*
    validate each field & return error msg if sth is invalidate
  */
  const validateFields = () => {
    const price_val = parseFloat(price);
    const fieldCheck = [
      {
        condition: !image,
        message: "Please select an image",
      },
      {
        condition: !title || !description || !price,
        message: "Please fill in all fields",
      },
      {
        condition: isNaN(price_val) || !isFinite(price_val),
        message: "Please enter a valid number for price",
      },
      {
        condition: !category,
        message: "Please select a category",
      },
      {
        condition: description.length > 30,
        message: "Description cannot be longer than 30 characters",
      },
    ];

    for (const { condition, message } of fieldCheck) {
      if (condition) {
        return message;
      }
    }
    return null;
  };

  /*
    prepare form data to upload on cloud 
  */
  const prepareFormData = async () => {
    const data = new FormData();

    if (Platform.OS === "web") {
      // Web-specific logic: Convert base64 to Blob for web uploads
      const base64String = image.uri.split(",")[1];
      const imageBlob = base64ToBlob(base64String, "image/jpeg");
      data.append("file", imageBlob, "upload_image.jpg");
    } else {
      // Mobile-specific logic: Directly append image URI
      data.append("file", {
        uri: image.uri, // Use the URI directly for mobile
        name: title, // Filename (Cloudinary expects a filename)
        type: "image/jpeg", // Adjust based on the image format (e.g., 'image/png' if PNG)
      });
    }

    data.append("upload_preset", "edevre");
    data.append("name", title);
    data.append("public_id", title.replace(/\s+/g, "_"));
    data.append("description", description);
    data.append("price", price);
    data.append("category", category);
    data.append("folder", "artwork");

    return data;
  };

  /*
    upload img to cloud & return url
  */
  const uploadImageToCloud = async (data) => {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dttomxwev/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    return response.json();
  };

  /*
    handler when user select img
  */
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

    console.log("Picker Result:", pickerResult);

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

  /*
    handler when user upload img
    */
  const handleUpload = async () => {
    const errorMsg = validateFields();
    if (errorMsg) {
      displayError(errorMsg);
      return;
    }

    setIsLoading(true);
    console.log("triggering loading state");

    try {
      console.log("inside try block, preparing form data");
      const data = await prepareFormData();

      console.log("Form data prepared, uploading to Cloudinary...");
      const result = await uploadImageToCloud(data);
      if (!result.secure_url) {
        displayError(result.error.message || "Image upload failed");
        return;
      }

      // loading animation while fetching

      const userId = userData.user.user._id,
        userName = userData.user.user.name,
        token = userData.token;

      const imageData = {
        userId: userId,
        artistName: userName,
        name: title,
        imageLink: result.secure_url,
        price: price,
        description: description,
        category: category,
      };

      console.log("Upload successful, processing response...");
      const response = await uploadImage(imageData, token);
      if (response.success) {
        resetForm();
        Alert.alert("Success", "Image uploaded successfully!");
      } else {
        displayError(response.data?.error || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      displayError("An error occurred while uploading the image");
    } finally {
      setIsLoading(false);
      console.log("upload complete, turn off loading animation");
    }
  };

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/UploadSample.png")}
          style={styles.exampleImage}
        />
        <View style={styles.imagePlaceholderContainer}>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={selectImage}
          >
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholderText}>Upload Image</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Category"
        style={styles.dropdown}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={{
          maxHeight: 150,
        }}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.everything}>
      <>
        <ImageBackground
          source={require("../assets/backgrounds/navbar_bg_blue.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>

        <FlatList
          data={[{}]} // Use a FlatList with a single element to render the form
          renderItem={renderContent}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollContainer}
        />

        <FooterNavbar style={styles.footer} />
      </>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSection loadingMsg={"Uploading Your Art!"} size={"large"} />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  everything: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: "white",
  },
  imagePlaceholderContainer: {
    flex: 1,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#5f669c",
    borderStyle: "dotted",
    borderRadius: 2,
    backgroundColor: "white",
  },
  imagePlaceholderText: {
    color: "#7c809c",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "white",
  },
  exampleImage: {
    width: "50%",
    height: 250,
    resizeMode: "stretch",
    marginRight: 0,
    backgroundColor: "white",
  },
  input: {
    height: 38,
    borderColor: "blue",
    backgroundColor: "white",
    borderWidth: 2,
    marginVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  dropdown: {
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 4,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWeight: "2",
  },
  uploadButton: {
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 16,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    zIndex: 10,
  },
  LoadingGif: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default Upload;

// Helper function to convert base64 to Blob
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
