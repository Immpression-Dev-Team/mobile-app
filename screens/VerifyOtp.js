import React, { useRef, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { verifyOtp } from "../API/API";

const logoImage = require("../assets/Logo_T.png");
const headerImage = require("../assets/headers/Immpression_multi.png");
const backgroundImage = require("../assets/backgrounds/paint_background.png");

const DIGITS = 4;

export default function VerifyOtp() {
  const [code, setCode] = useState(Array(DIGITS).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef([]);
  const route = useRoute();
  const navigation = useNavigation();

  const { email, password } = route.params ?? { email: "", password: "" };

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

    if (!email?.trim()) {
      setError("Missing email for verification.");
      return;
    }
    if (joined.length !== DIGITS) {
      setError(`Please enter the ${DIGITS}-digit code.`);
      return;
    }

    try {
      setIsLoading(true);
      const result = await verifyOtp(email, joined);
      if (!result?.success) throw new Error("Invalid OTP. Please try again.");

      navigation.navigate("SignUp", { email, password });
    } catch (err) {
      setError(err?.message || "An unexpected error occurred");
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
            {/* Centered Content */}
            <View style={styles.centerBlock}>
              <Image source={logoImage} style={styles.logo} />
              <Image source={headerImage} style={styles.headerImage} />

              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>
                We sent a code to{" "}
                <Text style={styles.emailText}>{email}</Text>
              </Text>

              {/* OTP Card */}
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
                      onSubmitEditing={() =>
                        idx === DIGITS - 1
                          ? Keyboard.dismiss()
                          : inputsRef.current[idx + 1]?.focus()
                      }
                    />
                  ))}
                </View>

                {!!error && <Text style={styles.error}>{error}</Text>}

                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    styles.button,
                    (pressed || isLoading) && styles.buttonPressed,
                  ]}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </Text>
                </Pressable>

                <View style={styles.hintRow}>
                  <Text style={styles.hintText}>Didn’t get a code?</Text>
                  <Pressable onPress={() => {}}>
                    <Text style={styles.hintLink}>Resend</Text>
                  </Pressable>
                </View>
              </View>
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
    justifyContent: "center", // centers vertically
    alignItems: "center", // centers horizontally
    paddingHorizontal: 24,
  },

  centerBlock: {
    alignItems: "center",
    gap: 12, // tighter spacing between logo, header, and title
    width: "100%",
    maxWidth: 400,
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
  emailText: { fontWeight: "700", color: "#1E2A3A" },

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

  label: { fontSize: 14, color: "#3C3D52", marginBottom: 12 },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 12,
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

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 4,
  },

  button: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    width: "80%",
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  hintRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  hintText: { color: "#3C3D52" },
  hintLink: {
    color: "#1E2A3A",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
