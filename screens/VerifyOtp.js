import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { verifyOtp } from "../API/API";
import { useNavigation, useRoute } from "@react-navigation/native";

const logoImage = require("../assets/Logo_T.png");
const headerImage = require("../assets/headers/Immpression_multi.png");
const backgroundImage = require("../assets/backgrounds/paint_background.png");

const VerifyOtp = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  console.log("Route Params:", route.params);

  const { email, password } = route.params; // Get the email passed from request otp screen

  const navigation = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!code.trim()) {
      setError("Please enter the OTP code");
      return;
    }

    try {
      setIsLoading(true); // Add a loading state
      const result = await verifyOtp(email, code);

      if (!result.success === true) {
        throw new Error("Invalid OTP. Please try again.");
      }

      navigation.navigate("SignUp", { email, password });
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
        <Text
          style={{
            color: "blue",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 25,
            fontWeight: 700,
          }}
        >
          Verify OTP
        </Text>

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
                  placeholder="Input your email address"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Icon
                  name="key"
                  size={14}
                  color="#000"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Input 4 digit code"
                  value={code}
                  onChangeText={(text) => setCode(text)}
                  style={styles.input}
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
            </View>

            <View style={styles.buttonContainer}>
              <Pressable onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Verify</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </ImageBackground>
  );
};

export default VerifyOtp;

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
    marginTop: 20, // Adjust this value to bring buttons higher up
  },
  button: {
    backgroundColor: "blue",
    width: "100%",
    padding: 11,
    borderRadius: 20,
    marginTop: 10,
    minHeight: 50, // Ensure the button maintains a visible height
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
