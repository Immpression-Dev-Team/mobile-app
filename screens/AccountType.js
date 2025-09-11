import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateAccountType } from '../API/API';
import { useAuth } from '../state/AuthProvider';

const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');
const artistEmoji = require('../assets/emojis/artistemoji.png');

const AccountTypeScreen = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

// inside AccountTypeScreen
const handleSelection = async (type) => {
  try {
    await updateAccountType(type, token);

    if (type === 'artist') {
      // First ask what type of artist they are
      navigation.navigate('ArtistType');
    } else {
      // Art-lover path (no ZIP)
      navigation.navigate('ArtPreferences');
    }
  } catch (error) {
    console.error('Error updating account type:', error);
  }
};


  return (
    <View style={styles.container}>
      {/* Header wave */}
      <View style={styles.waveHeader}>
        <ImageBackground source={backgroundImage} style={styles.waveImage} />
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerBlock}>
          {/* Headings */}
          <View style={styles.headingContainer}>
            <Text style={styles.subHeading}>ARE YOU AN ARTIST</Text>
            <Text style={styles.mainHeading}>& DO YOU WANT TO SELL ART?</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.buttons}>
              {/* YES — selling */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => handleSelection('artist')}
                activeOpacity={0.9}
                accessibilityLabel="Yes, I'm an artist and I want to sell"
              >
                <Text style={styles.primaryBtnText}>YES — I WANT TO SELL</Text>
                <Image source={artistEmoji} style={styles.artistEmoji} />
              </TouchableOpacity>

              {/* NO — browsing */}
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => handleSelection('art-lover')}
                activeOpacity={0.9}
                accessibilityLabel="No, I'm just here to look around"
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.secondaryBtnText}>NO</Text>
                  <Text style={styles.secondaryBtnSub}>
                    I'm just here to{'\n'}look around
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Image
              source={require('../assets/Logo_T.png')}
              style={styles.loading}
            />
          </View>
        </View>
      </ScrollView>

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



const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  waveHeader: {
    height: 90,
    width: '100%',
    overflow: 'hidden',
  },
  waveFooter: {
    height: 90,
    width: '100%',
    overflow: 'hidden',
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

  bodyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  centerBlock: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 16,
  },

  // Headings
  headingContainer: {
    alignItems: 'center',
    gap: 4,
  },
  subHeading: {
    fontSize: 14,
    letterSpacing: 1.2,
    color: '#3C3D52',
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainHeading: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: '#1E2A3A',
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },

  // Buttons block
  buttons: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },

  // Primary button (YES — selling)
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1E2A3A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  artistEmoji: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // Secondary button (NO — browsing)
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2F8',
    borderWidth: 1.5,
    borderColor: '#C6C7DE',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    color: '#1E2A3A',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  secondaryBtnSub: {
    color: '#3C3D52',
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
  },

  // Loading
  loading: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginTop: 16,
  },
});

export default AccountTypeScreen;