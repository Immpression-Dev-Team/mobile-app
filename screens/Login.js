import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  useNavigation,
  useNavigationContainerRef,
} from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../API_URL";
import Icon from "react-native-vector-icons/FontAwesome";
import { handleLogin } from "../utils/handleLogin.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../state/AuthProvider";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { showToast } from "../utils/toastNotification";
import * as AuthSession from "expo-auth-session";
import Constants, { ExecutionEnvironment } from "expo-constants";

const logoImage = require("../assets/Logo_T.png");
const headerImage = require("../assets/headers/Immpression_multi.png");
const backgroundImage = require("../assets/backgrounds/paint_background.png");

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, userData } = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const navigationRef = useNavigationContainerRef();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID",
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: "hello world",
    redirectUri: makeRedirectUri(),
    shouldAutoExchangeCode:
      Constants.executionEnvironment !== ExecutionEnvironment.StoreClient
        ? true
        : undefined,
  });

  useEffect(() => {
    if (userData && navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  }, [userData]);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication.idToken);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      const apiResponse = await axios.post(`${API_URL}/google-login`, {
        token: idToken,
      });
      await login(apiResponse?.data?.user);
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to login with Google");
      showToast("Login Error");
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError("");
      await promptAsync();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to start Google Sign-In");
      showToast("Sign-In Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault?.();
    setError("");

    try {
      const result = await handleLogin(email, password, login);
      if (!result.success) {
        setError("Invalid email or password");
        return;
      }

      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        login(JSON.parse(storedUser));
      }

      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }, 300);
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password");
      return;
    }
  };

  const navigateTo = (screenName) => navigation.navigate(screenName);

  return (
    <ImageBackground source={backgroundImage} style={styles.bg}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: "height" })}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header (centered) */}
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} />
              <Image source={headerImage} style={styles.headerImage} />
            </View>

            {/* Big Card */}
            <View style={styles.card}>
              <View style={styles.inputWrapper}>
                <Icon name="envelope" size={14} color="#000" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color="#000" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>

              {!!error && <Text style={styles.error}>{error}</Text>}

              <Text
                onPress={() => navigateTo("PasswordReset")}
                style={styles.forgotPasswordText}
              >
                Forgot Password?
              </Text>

              <Pressable onPress={handleSubmit} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Log in</Text>
              </Pressable>

              <Pressable
                disabled={!request}
                onPress={signInWithGoogle}
                style={styles.googleBtn}
              >
                <Icon name="google" size={18} color="#fff" style={styles.googleIcon} />
                <Text style={styles.googleText}>Sign in with Google</Text>
              </Pressable>

              <Pressable
                onPress={() => navigateTo("RequestOtp")}
                style={styles.textOnlyBtn}
              >
                <Text style={styles.textOnlyText}>Sign Up</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};



/* ===== Styles ===== */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1, resizeMode: "cover" },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",   // vertical center
    alignItems: "center",        // horizontal center
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Header stack
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  logo: { width: 72, height: 72, resizeMode: "contain" },
  headerImage: { width: 220, height: 56, resizeMode: "contain" },

  // Card container
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    alignItems: "center",
  },

  // Inputs
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F2F8",
    borderColor: "#C6C7DE",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    width: "100%",
    marginTop: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
  },

  // Error + links
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    alignSelf: "stretch",
  },
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 10,
    color: "#3C3D52",
    textDecorationLine: "underline",
  },

  // Buttons
  primaryBtn: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  googleBtn: {
    backgroundColor: "#DB4437",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  googleIcon: { marginRight: 8 },
  googleText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  textOnlyBtn: { marginTop: 10 },
  textOnlyText: {
    color: "#1E2A3A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default Login;