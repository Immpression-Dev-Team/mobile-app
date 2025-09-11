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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../API_URL";
import { handleLogin } from "../utils/handleLogin";
import { showToast } from "../utils/toastNotification";
import { useAuth } from "../state/AuthProvider";

const logoImage = require("../assets/Logo_T.png");
const headerImage = require("../assets/headers/Immpression_multi.png");
const backgroundImage = require("../assets/backgrounds/paint_background.png");

const SignUp = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ellipsis, setEllipsis] = useState("");
  const [error, setError] = useState("");

  const route = useRoute();
  const { email, password } = route.params || { email: "", password: "" };

  const { login } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoading) {
      const id = setInterval(
        () => setEllipsis((prev) => (prev.length < 3 ? prev + "." : "")),
        500
      );
      return () => clearInterval(id);
    } else {
      setEllipsis("");
    }
  }, [isLoading]);

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault?.();
    setError("");

    if (name.trim().length < 4) {
      setError("Name must be at least 4 characters long.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email });
      if (response.data.success) {
        const result = await handleLogin(email, password, login);
        if (result.success) {
          navigation.navigate("AccountType"); // 👈 next screen
        } else {
          showToast("Login failed after signup");
        }
      } else {
        showToast("Signup failed");
      }
    } catch (err) {
      showToast("Error during signup");
      setError(err?.response?.data?.error || "Signup error");
    } finally {
      setIsLoading(false);
    }
  };

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
            <View style={styles.centerBlock}>
              <Image source={logoImage} style={styles.logo} />
              <Image source={headerImage} style={styles.headerImage} />

              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Almost there! Choose a username.
              </Text>

              
              <View style={styles.card}>
                {/* Email (read-only) */}
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
                    editable={false}
                    style={[styles.input, styles.inputDisabled]}
                  />
                </View>

                {/* Username */}
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
                    onChangeText={setName}
                    style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {!!error && <Text style={styles.error}>{error}</Text>}

                <Pressable
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.button,
                    (pressed || isLoading) && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? `Signing Up${ellipsis}` : "Sign Up"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => navigation.navigate("Login")}
                  style={styles.textOnlyBtn}
                >
                  <Text style={styles.textOnlyBtnText}>Back to Login</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1, resizeMode: "cover" },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  centerBlock: {
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 420,
  },

  logo: { width: 72, height: 72, resizeMode: "contain" },
  headerImage: { width: 220, height: 56, resizeMode: "contain" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E2A3A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#3C3D52",
    textAlign: "center",
  },

  card: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    alignItems: "center",
  },

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
  input: { flex: 1, fontSize: 16 },
  inputDisabled: { color: "#6b7280" },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    alignSelf: "stretch",
  },

  button: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  textOnlyBtn: { marginTop: 10 },
  textOnlyBtnText: {
    color: "#1E2A3A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default SignUp;
