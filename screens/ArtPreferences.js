import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ArtTypes } from '../utils/constants';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { updateArtType } from '../API/API';

const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');
const loadingGif = require('../assets/Logo_T.png');

const ArtPreferences = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

  const [selectedArtTypes, setSelectedArtTypes] = useState([]);

  const toggleType = (name) => {
    setSelectedArtTypes((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleProceed = async () => {
    try {
      const response = await updateArtType(selectedArtTypes, token);
      if (response?.success) {
        navigation.navigate('Home');
      } else {
        console.warn('Update failed:', response?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error updating art types:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header wave */}
      <View style={styles.waveHeader}>
        <ImageBackground source={backgroundImage} style={styles.waveImage} />
      </View>

      {/* 🔙 Back Button (matches ArtistType) */}
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
          <Text style={styles.mainHeading}>ART</Text>
          <Text style={styles.subHeading}>DO YOU LIKE?</Text>
        </View>

        {/* Buttons grid (compact, 2 columns) */}
        <View style={styles.buttons}>
          {ArtTypes.map((type) => {
            const selected = selectedArtTypes.includes(type.name);
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.9}
                style={[
                  styles.button,
                  selected && styles.buttonSelected,
                ]}
                onPress={() => toggleType(type.name)}
              >
                <View style={styles.textWrap}>
                  <Text style={styles.primaryText}>{type.name}</Text>
                  {!!type.secondaryName && (
                    <Text style={styles.secondaryText}>{type.secondaryName}</Text>
                  )}
                </View>
                <Image source={type.icon} style={styles.icon} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Proceed button */}
        <TouchableOpacity
          style={[
            styles.proceedBtn,
            selectedArtTypes.length === 0 && { opacity: 0.6 },
          ]}
          onPress={handleProceed}
          disabled={selectedArtTypes.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>


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
  buttonSelected: {
    backgroundColor: '#0284c7',
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

  proceedBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 14,
    width: '90%',          // ✅ makes it wide and consistent
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center',   // centers it nicely
  },
  proceedText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  

  loading: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginTop: 20,
  },
});


export default ArtPreferences;