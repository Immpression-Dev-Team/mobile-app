import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ArtistTypes } from '../utils/constants';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { updateArtistType } from '../API/API';
import Ionicons from 'react-native-vector-icons/Ionicons';

const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');
const loadingGif = require('../assets/Logo_T.png');

const ArtistType = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

  // inside ArtistType
  const handleSelection = async (type) => {
    try {
      const res = await updateArtistType(type, token);
      if (res?.success) {
        // Now ask for ZIP (only for artists)
        navigation.navigate('ZipCode', { nextScreen: 'Home' });
        // If you want to send them somewhere else next, change 'Home'
        // e.g. { nextScreen: 'SellGuide' }
      } else {
        console.warn('Update failed:', res?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating artist type:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* Header wave */}
      <View style={styles.waveHeader}>
        <ImageBackground source={backgroundImage} style={styles.waveImage} />
      </View>

      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={22} color="#1E2A3A" />
      </TouchableOpacity>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headingContainer}>
          <Text style={styles.subHeading}>WHAT TYPE OF</Text>
          <Text style={styles.mainHeading}>ARTIST</Text>
          <Text style={styles.subHeading}>ARE YOU?</Text>
        </View>

        {/* Buttons grid */}
        <View style={styles.buttons}>
          {ArtistTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              activeOpacity={0.9}
              style={styles.button}
              onPress={() =>
                handleSelection(
                  `${type.name}${type.secondaryName ? type.secondaryName : ''}`
                )
              }
            >
              <View style={styles.textWrap}>
                <Text style={styles.primaryText}>{type.name}</Text>
                {type.secondaryName && (
                  <Text style={styles.secondaryText}>{type.secondaryName}</Text>
                )}
              </View>
              <Image source={type.icon} style={styles.icon} />
            </TouchableOpacity>
          ))}
        </View>

        <Image source={loadingGif} style={styles.loading} />
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
    marginBottom: 24,
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

  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  button: {
    width: '48%',
    backgroundColor: '#1E2A3A',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textWrap: {
    flexShrink: 1,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  secondaryText: {
    color: '#C6C7DE',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 6,
  },

  loading: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginTop: 20,
  },
});

export default ArtistType;