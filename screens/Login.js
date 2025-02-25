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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../config";
import Icon from "react-native-vector-icons/FontAwesome"; // Import your preferred icon set
import { handleLogin } from "../utils/handleLogin.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../state/AuthProvider";
import SignUp from "./SignUp";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const logoImage = require("../assets/Logo_T.png"); // Adjust the path to your logo image
const headerImage = require("../assets/headers/Immpression_multi.png"); // Adjust the path to your header image
const backgroundImage = require("../assets/backgrounds/paint_background.png"); // Adjust the path to your background image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, userData } = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState("");

  // only navigate when userData turns back to null
  useEffect(() => {
    if (userData) {
      console.log("Log in success. Now going to home screen");
      navigation.navigate("Home");
    }
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "633936981185-de39dtiqk9rntfsuo9foujo35igfugcs.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await GoogleSignin.signIn();
      console.log("Google Sign-In Success:", res);
      const token = res.data.idToken;
      console.log("Token:", token);
      const response = await axios.post(`${API_URL}/google-login`, { token });
      await login(response?.data?.user);
      showToast("Login Successful");
    } catch (error) {
      showToast("Google Sign-In Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const result = await handleLogin(email, password, login);
    if (!result.success) {
      setError("Invalid email or password");
    }
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
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
            <View style={styles.buttonContainer}>
              <Pressable onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Log in</Text>
              </Pressable>

              <Pressable
                onPress={signInWithGoogle}
                style={[styles.button, styles.googleButton]}
              >
                <Icon
                  name="google"
                  size={20}
                  color="white"
                  style={styles.googleIcon}
                />
                <Text style={styles.buttonText}>Sign in with Google</Text>
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
  googleButton: {
    backgroundColor: "#DB4437",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    marginRight: 10,
  },
});
