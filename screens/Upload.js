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
  Switch,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../state/AuthProvider";
import { uploadImage } from "../API/API";
import LoadingSection from "../components/home_sections/SectionTemplate/LoadingSection";
import ScreenTemplate from "./Template/ScreenTemplate";

const Upload = () => {
  const { userData } = useAuth();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isFramed, setIsFramed] = useState(false);
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

  const resetForm = () => {
    setImage(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setHeight("");
    setWidth("");
    setIsSigned(false);
    setIsFramed(false);
  };

  const displayError = (message) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Error", message);
    }
  };

  const validateFields = () => {
    const priceVal = parseFloat(price);
    const heightVal = parseFloat(height);
    const widthVal = parseFloat(width);
    const fieldCheck = [
      { condition: !image, message: "Please select an image" },
      {
        condition: !title || !description || !price || !height || !width,
        message: "Please fill in all fields",
      },
      {
        condition: isNaN(priceVal) || priceVal <= 0,
        message: "Please enter a valid number for price",
      },
      {
        condition: isNaN(heightVal) || isNaN(widthVal),
        message: "Please enter valid dimensions for height and width",
      },
      {
        condition: !category,
        message: "Please select a category",
      },
      {
        condition: description.length > 1000,
        message: "Description cannot be longer than 1000 characters",
      },
    ];

    for (const { condition, message } of fieldCheck) {
      if (condition) return message;
    }
    return null;
  };

  const prepareFormData = async () => {
    const data = new FormData();

    if (Platform.OS === "web") {
      const base64String = image.uri.split(",")[1];
      const imageBlob = base64ToBlob(base64String, "image/jpeg");
      data.append("file", imageBlob, "upload_image.jpg");
    } else {
      data.append("file", {
        uri: image.uri,
        name: title,
        type: "image/jpeg",
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

  const handleUpload = async () => {
    const errorMsg = validateFields();
    if (errorMsg) {
      displayError(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const data = await prepareFormData();
      const result = await uploadImageToCloud(data);
      if (!result.secure_url) {
        displayError(result.error.message || "Image upload failed");
        return;
      }

      const userId = userData.user.user._id;
      const userName = userData.user.user.name;
      const token = userData.token;

      const imageData = {
        userId,
        artistName: userName,
        name: title,
        imageLink: result.secure_url,
        price: parseFloat(price),
        description,
        category,
        stage: "review",
        dimensions: {
          height: parseFloat(height),
          width: parseFloat(width),
        },
        isSigned,
        isFramed,
      };

      const response = await uploadImage(imageData, token);
      if (response.success) {
        resetForm();
        Alert.alert("Success", "Your artwork has been submitted for review!");
      } else {
        displayError(response.data?.error || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      displayError("An error occurred while uploading the image");
    } finally {
      setIsLoading(false);
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
      <TextInput
        style={styles.input}
        placeholder="Height (in)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Width (in)"
        value={width}
        onChangeText={setWidth}
        keyboardType="numeric"
      />

      <View style={styles.switchContainer}>
        <Text>Signed:</Text>
        <Switch value={isSigned} onValueChange={setIsSigned} />
      </View>

      <View style={styles.switchContainer}>
        <Text>Framed:</Text>
        <Switch value={isFramed} onValueChange={setIsFramed} />
      </View>

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
        dropDownContainerStyle={{ maxHeight: 150 }}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenTemplate>
      <FlatList
        data={[{}]}
        renderItem={renderContent}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSection loadingMsg="Uploading Your Art!" size="large" />
        </View>
      )}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 50,
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    justifyContent: "space-between",
  },
});

export default Upload;

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
