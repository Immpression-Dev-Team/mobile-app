import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  ImageBackground, // Import ImageBackground component
} from 'react-native';
import React, { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import { API_URL } from '../config';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { handleLogin } from '../utils/handleLogin';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your preferred icon set
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { showToast } from '../utils/toastNotification';
import { useAuth } from '../state/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const logoImage = require('../assets/Logo_T.png'); // Adjust the path to your logo image
const headerImage = require('../assets/headers/Immpression_multi.png'); // Adjust the path to your header image
const backgroundImage = require('../assets/backgrounds/babyBlue.png'); // Adjust the path to your background image

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ellipsis, setEllipsis] = useState('');

  const [error, setError] = useState('');

  const { login } = useAuth();

  const navigation = useNavigation();

  // Animate loading state
  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500); // Adjust the speed as desired

      return () => clearInterval(intervalId); // Clear interval on unmount or stop loading
    } else {
      setEllipsis(''); // Reset ellipsis when not loading
    }
  }, [isLoading]);

  // Simple email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // TODO: set up frontend confirmPassword logic before calling handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.length < 4) {
      setError('Name must be at least 4 characters long.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const result = await handleLogin(email, password, login);

        if (result.success) {
          navigation.navigate('AccountType');
        }
      } else {
        console.log('Signup failed');
        showToast('Signup Failed');
      }
    } catch (err) {
      showToast('Error during login');
      console.log('Error during login:', err.response.data);
      setError(err.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(passwordLengthError);

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* <NavBar /> */}
        <KeyboardAvoidingView style={styles.signUpContainer} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.totalHeader}>
              <View style={styles.logoContainer}>
                <Image source={logoImage} style={styles.logo} />
              </View>
              <View style={styles.headerImageContainer}>
                <Image source={headerImage} style={styles.headerImage} />
              </View>
            </View>

            <View style={styles.socialButtonsContainer}>
              <Pressable 
                onPress={() => promptAsync()} 
                style={styles.socialButton}
              >
                <Icon name="google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </Pressable>

              <Pressable 
                onPress={handleFacebookLogin} 
                style={styles.socialButton}
              >
                <Icon name="facebook" size={20} color="#4267B2" />
                <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
              </Pressable>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* <Text style={styles.title}>Sign Up to Impression</Text> */}
            <View style={styles.contentContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="user"
                    size={18}
                    color="#000"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Username"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="envelope"
                    size={14}
                    color="#000"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="lock"
                    size={20}
                    marginLeft={1}
                    color="#000"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {passwordLengthError
                ? 'Password must be at least 6 characters'
                : ''}
            </Text>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {error ? error : ''}
            </Text>
            {/* <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} style={styles.input} secureTextEntry /> */}
          </View>
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={[
              styles.button,
              styles.buttonOutline,
              isLoading && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.buttonOutlineText}>
              {isLoading ? `Signing Up${ellipsis}` : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleBack}
            style={[styles.button, styles.buttonOutline2]}
          >
            <Text style={styles.buttonOutlineText2}>Back to Login</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  signUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust the top padding to create space between NavBar and Sign Up section
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    marginTop: 0, // Adjust this value to bring inputs higher up
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6C7DE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  contentContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    width: '80%',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: 'blue',
    marginTop: 10,
    borderRadius: 20,
  },
  buttonOutline2: {
    backgroundColor: 'transparent',
    marginTop: 10,
    borderRadius: 20,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  buttonOutlineText2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  headerImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 12,
  },
  headerImage: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
  },
  totalHeader: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  socialButtonsContainer: {
    width: '100%',
    marginTop: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
});
