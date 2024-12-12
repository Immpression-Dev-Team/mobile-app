import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ArtistTypes } from '../utils/constants';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { updateArtistType } from '../API/API';
const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');
const loadingGif = require('../assets/loading-gif.gif');

const ArtistType = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

  const handleSelection = async (type) => {
    try {
      const response = await updateArtistType(type, token);
      console.log('response from updating artist type: ' + response);
      // Check if the response indicates a successful operation
      if (response.success) {
        navigation.navigate('Home');
      } else {
        console.warn(
          'Update failed with message:',
          response.message || 'Unknown error'
        );
      }
    } catch (error) {
      console.error('Error updating artist type:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        />
      </View>

      {/* body */}
      <View style={styles.body}>
        <View style={styles.headingContainer}>
          <Text style={styles.subHeading}>WHAT TYPE OF</Text>
          <Text style={styles.mainHeading}>ARTIST</Text>
          <Text style={styles.subHeading}>ARE YOU?</Text>
        </View>

        {/* buttons */}
        <View style={styles.buttons}>
          {ArtistTypes.map((type) => (
            <TouchableOpacity
              style={styles.button}
              key={type.id}
              onPress={() =>
                handleSelection(
                  `${type.name}${type.secondaryName ? type.secondaryName : ''}`
                )
              }
            >
              <Text style={styles.buttonText}>
                <Text style={styles.primaryName}>{type.name}</Text> {'\n'}
                {type.secondaryName && (
                  <Text style={styles.secondaryName}>{type.secondaryName}</Text>
                )}
              </Text>
              <Image source={type.icon} style={styles.buttonImage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* loading gif */}
        <Image source={loadingGif} style={styles.loading} />
      </View>

      {/* footer */}
      <View style={styles.header}>
        <ImageBackground
          source={backgroundImage}
          style={styles.footerBackgroundImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%',
  },
  body: {
    height: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginVertical: 65,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 15,
    // gap: 5,
    // maxWidth: '80%',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    borderRadius: 16,
    marginBottom: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    width: '49%',
    aspectRatio: 1,
    alignItems: 'center',
  },
  loading: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginTop: 70,
  },
  buttonImage: {
    width: 30,
    height: 30,
  },
  headingContainer: {
    fontWeight: '900',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: 40,
    fontWeight: '900',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '900',
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 10,
    padding: 10,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footerBackgroundImage: {
    transform: [{ rotate: '180deg' }],
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ArtistType;
