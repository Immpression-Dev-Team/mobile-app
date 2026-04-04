import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Platform,
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { resetPassword } from "../API/API";

const logoImage = require('../assets/Logo_T.png');
const headerImage = require('../assets/headers/Immpression_multi.png');
const backgroundImage = require('../assets/backgrounds/paint_background.png');

const DIGITS = 4;

export default function ResetPasswordConfirm() {
  const [code, setCode] = useState(Array(DIGITS).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef([]);
  const route = useRoute();
  const navigation = useNavigation();

  const { email } = route.params ?? { email: "" };

  const handleChangeDigit = (text, idx) => {
    const value = text.replace(/[^0-9]/g, "");
    const next = [...code];
    next[idx] = value.slice(-1);
    setCode(next);
    if (value && idx < DIGITS - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setError("");
    const joined = code.join("");

    if (joined.length !== DIGITS) {
      setError(`Please enter the ${DIGITS}-digit code.`);
      return;
    }
    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword(email, joined, newPassword);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to reset password. Please try again.");
      }
      navigation.navigate("Login");
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
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
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} />
              <Image source={headerImage} style={styles.headerImage} />
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We sent a 4-digit code to{" "}
                <Text style={styles.emailBold}>{email}</Text>
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Enter 4-digit code</Text>
              <View style={styles.otpRow}>
                {code.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    value={digit}
                    onChangeText={(t) => handleChangeDigit(t, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textContentType="oneTimeCode"
                    returnKeyType={idx === DIGITS - 1 ? "done" : "next"}
                  />
                ))}
              </View>

              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color="#000" style={styles.inputIcon} />
                <TextInput
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={styles.input}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>

              {!!error && <Text style={styles.error}>{error}</Text>}

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (pressed || isLoading) && styles.btnPressed,
                ]}
                disabled={isLoading}
              >
                <Text style={styles.primaryBtnText}>
                  {isLoading ? "Resetting…" : "Reset Password"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Login")}
                style={styles.textOnlyBtn}
              >
                <Text style={styles.textOnlyText}>Back to Login</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1, resizeMode: "cover" },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  logo: { width: 72, height: 72, resizeMode: "contain" },
  headerImage: { width: 220, height: 56, resizeMode: "contain" },
  title: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    color: "#1E2A3A",
  },
  subtitle: {
    fontSize: 13,
    color: "#3C3D52",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  emailBold: { fontWeight: "700", color: "#1E2A3A" },

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

  label: { fontSize: 14, color: "#3C3D52", marginBottom: 12 },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 16,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C6C7DE",
    backgroundColor: "#F1F2F8",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  otpBoxFilled: {
    backgroundColor: "#E7E9F6",
    borderColor: "#9AA0C3",
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
    marginBottom: 4,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 8,
    alignSelf: "stretch",
  },

  primaryBtn: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  btnPressed: { opacity: 0.7 },

  textOnlyBtn: { marginTop: 12 },
  textOnlyText: {
    color: "#1E2A3A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
