import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../components/Navbar';

const Upload = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const selectImage = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (result.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.cancelled) {
            setImage(pickerResult.uri);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!image || !title || !description || !price) {
            Alert.alert('Error', 'Please fill in all fields and select an image');
            return;
        }

        // Handle the image upload logic here
        await Alert.alert('Success', 'Image uploaded successfully!');
    };

    return (
        <View style={styles.mainContainer}>
            <Navbar />
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/UploadSample.png')} style={styles.exampleImage} />
                    <View style={styles.imagePlaceholderContainer}>
                        <TouchableOpacity style={styles.imagePlaceholder} onPress={selectImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
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
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
    },
    container: {
        padding: 16,
        // justifyContent: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    imagePlaceholderContainer: {
        flex: 1,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#5f669c',
        borderStyle: 'dotted',
        borderRadius: 2,

    },
    imagePlaceholderText: {
        color: '#7c809c',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    exampleImage: {
        width: '50%',
        height: 250,
        resizeMode: 'stretch',
        marginRight: 0, // Remove any margin between images
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    uploadButton: {
        height: 40,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 16,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Upload;
