import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  ImageBackground, // Import ImageBackground component
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome"; // Import your preferred icon set
import { handleLogin } from "../utils/handleLogin.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { useAuth } from "../state/AuthProvider";
import { API_URL, GOOGLE_CONFIG } from "../config";
import SignUp from "./SignUp";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const logoImage = require("../assets/Logo_T.png"); // Adjust the path to your logo image
const headerImage = require("../assets/headers/Immpression_multi.png"); // Adjust the path to your header image
const backgroundImage = require("../assets/backgrounds/paint_background.png"); // Adjust the path to your background image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const { login } = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };
  
    const checkPlayServices = async () => {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        return true;
      } catch (error) {
        console.error('Play services check failed:', error);
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setError('Google Play Services required for sign in');
        }
        return false;
      }
    };
    
    // Replace your current useEffect with this enhanced version
    useEffect(() => {
      const initializeGoogleSignIn = async () => {
        try {
          // Basic configuration
          const configOptions = {
            webClientId: '709309106647-pb9k612u1pe4olikmvfaaktkauj3bjts.apps.googleusercontent.com',
            iosClientId: '709309106647-rqnlk0i13qkb6qc901aoj3tapaskuu8t.apps.googleusercontent.com',
            offlineAccess: true
          };
    
          // If we're on iOS, we need to add the presenting view controller
          if (Platform.OS === 'ios') {
            GoogleSignin.configure({
              ...configOptions,
              // This tells iOS which screen should present the sign-in interface
              iosClientId: configOptions.iosClientId,
              openIdRealm: 'com.immpression.art', // Your bundle identifier
            });
          } else {
            // On Android, we can use the basic configuration
            GoogleSignin.configure(configOptions);
          }
    
          console.log('Google Sign-In configured successfully');
        } catch (error) {
          console.error('Google Sign-In configuration failed:', error);
        }
      };
    
      initializeGoogleSignIn();
    }, []);

    const handleFacebookSignIn = async () => {
      if (isLoading) return;
    
      try {
        setIsLoading(true); // Start loading state
        setError(''); // Clear any previous errors
        console.log('Attempting Facebook login...'); // Debug log
    
        // Configure login behavior
        LoginManager.setLoginBehavior('native_with_fallback');
    
        // Request permissions with validation
        const result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email'
        ]);
    
        console.log('Facebook permission result:', result); // Debug log
    
        // Validate permissions result
        if (result.isCancelled) {
          throw new Error('Login cancelled by user');
        }
    
        // Validate permissions granted
        if (!result.grantedPermissions?.includes('email')) {
          throw new Error('Email permission is required');
        }
    
        // Get access token with validation
        const data = await AccessToken.getCurrentAccessToken();
        console.log('Facebook access token received:', !!data); // Debug log
        
        // Validate access token
        if (!data?.accessToken) {
          throw new Error('Failed to get access token');
        }
    
        // Attempt server authentication with validation
        const response = await axios.post(`${API_URL}/auth/facebook`, {
          accessToken: data.accessToken,
        });
    
        console.log('Server response:', response.data); // Debug log
    
        // Validate server response structure
        if (!response?.data) {
          throw new Error('Invalid server response');
        }
    
        // Validate authentication success and token presence
        if (!response.data.success || !response.data.token) {
          throw new Error(response.data.message || 'Server authentication failed');
        }
    
        // If we get here, we have a valid token
        await login(response.data.token);
        navigation.navigate('Home');
    
      } catch (error) {
        console.error('Detailed Facebook Sign-In Error:', error);
        
        // Enhanced error handling with specific messages
        if (error.message.includes('cancelled')) {
          setError('Login was cancelled');
        } else if (error.message.includes('permission')) {
          setError('Required permissions were not granted');
        } else if (error.response?.data?.message) {
          // Server provided error message
          setError(`Authentication failed: ${error.response.data.message}`);
        } else {
          // Generic error with additional debug info
          setError(`Login failed: ${error.message || 'Unknown error occurred'}`);
        }
      } finally {
        setIsLoading(false); // End loading state
      }
    };

  
    const handleGoogleSignin = async () => {
      if (isLoading) return;

      try {
        setError(''); // Clear any previous errors
        
        // Check Play Services on Android
        const servicesAvailable = await checkPlayServices();
        if (!servicesAvailable) {
          return;
        }
    
        console.log('Attempting Google sign in...'); // Debug log
        const userInfo = await GoogleSignin.signIn();
        console.log('Google sign in successful:', userInfo); // Debug log
        
        if (!userInfo?.idToken || !userInfo?.user?.email) {
          throw new Error('Incomplete authentication data received from Google');
        }
    
        // Attempt server authentication with validation
        const response = await axios.post(`${API_URL}/auth/google`, {
          token: userInfo.idToken,
          email: userInfo.user.email,
        });
    
        // Validate server response
        if (!response?.data) {
          throw new Error('Invalid server response');
        }
    
        // Check for success and token presence
        if (!response.data.success || !response.data.token) {
          throw new Error(response.data.message || 'Server authentication failed');
        }
    
        // If we get here, we have a valid token
        await login(response.data.token);
        navigation.navigate('Home');
    
      } catch (error) {
        console.error('Detailed Google Sign-In Error:', error);
        
        // Enhanced error messages based on error type
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          setError('Sign in was cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          setError('Sign in is already in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setError('Play services are not available');
        } else if (error.response?.data?.message) {
          // Server provided error message
          setError(`Authentication failed: ${error.response.data.message}`);
        } else {
          // Generic error with additional debug info
          setError(`Sign in failed: ${error.message || 'Unknown error occurred'}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      const result = await handleLogin(email, password, login);
      if (result.success) {
        navigation.navigate('Home');
      } else {
        setError("Invalid email or password");
      }
    };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.totalHeader}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <View style={styles.headerImageContainer}>
            <Image source={headerImage} style={styles.headerImage} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior="padding"
          >
            <View style={styles.inputContainer}>
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
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {error && error}
              </Text>
              <Text
                onPress={() => navigateTo("PasswordReset")}
                style={styles.forgotPasswordText}
              >
                Forgot Password?
              </Text>
            </View>

            <View style={styles.socialButtonsContainer}>
              <Pressable 
                onPress={handleGoogleSignin} 
                style={styles.socialButton}
              >
                <Icon name="google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </Pressable>

              <Pressable 
                onPress={handleFacebookSignIn} 
                style={styles.socialButton}
              >
                <Icon name="facebook" size={20} color="#4267B2" />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </Pressable>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Log in</Text>
              </Pressable>
              <Pressable
                onPress={() => navigateTo("SignUp")}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.buttonOutlineText}>Sign Up</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
  },
  totalHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  headerImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 12,
  },
  headerImage: {
    width: 200,
    height: 50,
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  keyboardAvoidingContainer: {
    width: "80%",
  },
  inputContainer: {
    width: "100%",
    marginTop: -200, // Adjust this value to bring inputs higher up
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C6C7DE",
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
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 10,
    marginRight: 10,
    color: "#3C3D52",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50, // Adjust this value to bring buttons higher up
  },
  button: {
    backgroundColor: "blue",
    width: "100%",
    padding: 11,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  socialButtonsContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
