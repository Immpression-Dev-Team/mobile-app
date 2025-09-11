import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../state/AuthProvider';
import { updateUserProfile } from '../API/API'; // ✅ persist zipcode

const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');

const ZipCode = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useAuth();
  const token = userData?.token;

  // Where to go next after saving ZIP:
  // e.g. from AccountType: navigation.navigate('ZipCode', { nextScreen: type === 'artist' ? 'ArtistType' : 'ArtPreferences' })
  const nextScreen = route.params?.nextScreen ?? 'Home';

  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const formatZip = (raw) => {
    const digits = raw.replace(/[^\d]/g, '').slice(0, 9);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const isValidZip = (z) => /^\d{5}(-\d{4})?$/.test(z);

  const handleProceed = async () => {
    Keyboard.dismiss();
    setError('');

    if (!isValidZip(zip)) {
      setError('Enter a valid US ZIP (e.g., 94107 or 94107-1234).');
      return;
    }

    try {
      setSaving(true);
      // Persist on backend
      await updateUserProfile({ zipcode: zip.trim() }, token);
      // Continue to intended next screen
      navigation.navigate(nextScreen);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          'Could not save ZIP code. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header wave */}
      <View style={styles.waveHeader}>
        <ImageBackground source={backgroundImage} style={styles.waveImage} />
      </View>

      {/* Back chip */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color="#1E2A3A" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        style={styles.flex}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Headings */}
            <View style={styles.headingContainer}>
              <Text style={styles.subHeading}>WHAT’S YOUR</Text>
              <Text style={styles.mainHeading}>ZIP CODE?</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.helperText}>
                We use your ZIP to estimate shipping costs and delivery times so
                you can see accurate totals before checkout. This won’t be shown
                publicly.
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 94107 or 94107-1234"
                  maxLength={10}
                  keyboardType="number-pad"
                  value={zip}
                  onChangeText={(t) => setZip(formatZip(t))}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleProceed}
                />
              </View>

              {!!error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[
                  styles.proceedBtn,
                  (!isValidZip(zip) || saving) && { opacity: 0.6 },
                ]}
                onPress={handleProceed}
                disabled={!isValidZip(zip) || saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.proceedText}>Proceed</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigation.navigate(nextScreen)}
                activeOpacity={0.85}
                disabled={saving}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Footer wave */}
      <View style={styles.waveFooter}>
        <ImageBackground
          source={backgroundImage}
          style={styles.waveImageFlipped}
        />
      </View>
    </View>
  );
};

/* ===== Styles ===== */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  waveHeader: {
    height: 70,
    width: '100%',
  },
  waveFooter: {
    height: 70,
    width: '100%',
  },
  waveImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  waveImageFlipped: {
    transform: [{ rotate: '180deg' }],
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    padding: 6,
  },

  bodyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  headingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 14,
    letterSpacing: 1,
    color: '#3C3D52',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E2A3A',
  },

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

  helperText: {
    color: '#3C3D52',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },

  inputWrapper: {
    width: '100%',
    backgroundColor: '#F1F2F8',
    borderWidth: 1.5,
    borderColor: '#C6C7DE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginTop: 4,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: '#1E2A3A',
  },

  error: {
    color: 'red',
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },

  proceedBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 14,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  skipBtn: { marginTop: 10 },
  skipText: {
    color: '#1E2A3A',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default ZipCode;
