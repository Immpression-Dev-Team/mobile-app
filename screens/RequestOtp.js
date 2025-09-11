import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { requestOtp } from '../API/API';
import { useNavigation } from '@react-navigation/native';

const logoImage = require('../assets/Logo_T.png');
const headerImage = require('../assets/headers/Immpression_multi.png');
const backgroundImage = require('../assets/backgrounds/paint_background.png');

const RequestOtp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async (e) => {
    e.preventDefault?.();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const result = await requestOtp(email, password);
      if (!result?.success) {
        throw new Error('Failed to send email verification code. Try again later');
      }
      navigation.navigate('VerifyOtp', { email, password });
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.bg}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} />
              <Image source={headerImage} style={styles.headerImage} />
              <Text style={styles.title}>Get your verification code</Text>
              <Text style={styles.subtitle}>
                Enter your email and password to receive a 4-digit code.
              </Text>
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
                <Icon name="key" size={18} color="#000" style={styles.inputIcon} />
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

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (pressed || isLoading) && styles.btnPressed,
                ]}
                disabled={isLoading}
              >
                <Text style={styles.primaryBtnText}>
                  {isLoading ? 'Sending…' : 'Get Verification Code'}
                </Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate('Login')} style={styles.textOnlyBtn}>
                <Text style={styles.textOnlyText}>Back to Login</Text>
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
  bg: { flex: 1, resizeMode: 'cover' },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',   // vertical center
    alignItems: 'center',        // horizontal center
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Header
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  logo: { width: 72, height: 72, resizeMode: 'contain' },
  headerImage: { width: 220, height: 56, resizeMode: 'contain' },
  title: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2A3A',
  },
  subtitle: {
    fontSize: 13,
    color: '#3C3D52',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F8',
    borderColor: '#C6C7DE',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    width: '100%',
    marginTop: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
  },

  // Feedback
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    alignSelf: 'stretch',
  },

  // Buttons
  primaryBtn: {
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnPressed: { opacity: 0.9 },

  textOnlyBtn: { marginTop: 10 },
  textOnlyText: {
    color: '#1E2A3A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default RequestOtp;