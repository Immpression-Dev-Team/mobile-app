import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../state/AuthProvider';
import { uploadImage } from '../API/API';
import ScreenTemplate from './Template/ScreenTemplate';
import LoadingSection from '../components/home_sections/SectionTemplate/LoadingSection';

const Upload = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isFramed, setIsFramed] = useState(false);
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Paintings', value: 'paintings' },
    { label: 'Photography', value: 'photography' },
    { label: 'Graphic Design', value: 'graphic design' },
    { label: 'Illustrations', value: 'illustrations' },
    { label: 'Sculptures', value: 'sculptures' },
    { label: 'Woodwork', value: 'woodwork' },
    { label: 'Graffiti', value: 'graffiti' },
    { label: 'Stencil', value: 'stencil' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const displayError = (msg) =>
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);

  const selectImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) return alert('Permission required');

    const picker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!picker.canceled) {
      const selected = picker.assets[0];
      const resized = await ImageManipulator.manipulateAsync(
        selected.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ ...selected, uri: resized.uri });
    }
  };

  const handleSubmit = async () => {
    const priceVal = parseFloat(price);
    const heightVal = parseFloat(height);
    const widthVal = parseFloat(width);

    if (
      !image ||
      !title ||
      !description ||
      !priceVal ||
      !heightVal ||
      !widthVal ||
      !category
    ) {
      return displayError('Please complete all fields');
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: title,
        type: 'image/jpeg',
      });
      formData.append('upload_preset', 'edevre');
      formData.append('folder', 'artwork');

      const cloudRes = await fetch(
        'https://api.cloudinary.com/v1_1/dttomxwev/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const result = await cloudRes.json();

      if (!result.secure_url) return displayError('Image upload failed');

      const payload = {
        userId: userData.user.user._id,
        artistEmail: userData.user.user.email,
        artistName: userData.user.user.name,
        name: title,
        imageLink: result.secure_url,
        price: priceVal,
        description,
        category,
        stage: 'review',
        dimensions: { height: heightVal, width: widthVal },
        isSigned,
        isFramed,
      };

      const dbRes = await uploadImage(payload, userData.token);

      if (dbRes.success) {
        Alert.alert('Success', 'Artwork submitted for review!');
        setStep(1);
        setImage(null);
        setTitle('');
        setDescription('');
        setCategory('');
        setPrice('');
        setHeight('');
        setWidth('');
        setIsSigned(false);
        setIsFramed(false);
        navigation.navigate('Home');
      } else {
        displayError('Server Error: ' + (dbRes.data?.error || ''));
      }
    } catch (e) {
      console.error('Error submitting:', e);
      displayError('An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepOneValid = image && title && description && category;
  const isStepTwoValid = price && height && width;

  return (
    <ScreenTemplate>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          {step === 1 && (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageBox} onPress={selectImage}>
                {image ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <Text style={styles.imageText}>Tap to Upload Image</Text>
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                returnKeyType="next"
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
                dropDownContainerStyle={{ maxHeight: 150 }}
              />
              <TouchableOpacity
                style={[styles.button, { opacity: isStepOneValid ? 1 : 0.5 }]}
                onPress={() => isStepOneValid && setStep(2)}
                disabled={!isStepOneValid}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => setStep(1)}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreviewTop}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Height (in)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Width (in)"
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <View style={styles.switchRow}>
                <Text>Signed:</Text>
                <Switch value={isSigned} onValueChange={setIsSigned} />
              </View>
              <View style={styles.switchRow}>
                <Text>Framed:</Text>
                <Switch value={isFramed} onValueChange={setIsFramed} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Price ($)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  { marginTop: 16, opacity: isStepTwoValid ? 1 : 0.5 },
                ]}
                onPress={() => isStepTwoValid && handleSubmit()}
                disabled={!isStepTwoValid}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingSection loadingMsg="Uploading Your Art!" size="large" />
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderColor: '#ccc',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  imageBox: {
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
  },
  imageText: { color: '#007bff', fontSize: 16 },
  imagePreview: { width: '100%', height: '100%', borderRadius: 6 },
  imagePreviewTop: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },
});

export default Upload;
