import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateAccountType } from '../API/API';
import { useAuth } from '../state/AuthProvider';

const backgroundImage = require('../assets/backgrounds/navbar_bg_blue.png');

const AccountTypeScreen = () => {
  const { userData } = useAuth();
  const token = userData?.token;
  const navigation = useNavigation();

  const handleSelection = async (type) => {
    try {
      // call api to update account type
      const response = await updateAccountType(type, token);
      console.log('this is response', response);
      // after successful update, navigate to home screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating account type:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        ></ImageBackground>
      </View>

      {/* body */}
      <View style={styles.body}>
        <View style={styles.headingContainer}>
          <Text style={styles.subHeading}>ARE YOU AN</Text>
          <Text style={styles.mainHeading}>ARTIST?</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelection('artist')}
          >
            <Text style={styles.buttonText}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => handleSelection('art-lover')}
          >
            <Text style={styles.buttonText}>NO,</Text>
            <Text style={styles.extraText}>I'm here to {'\n'}look around</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/loading-gif.gif')}
          style={styles.loading}
        />
      </View>
      <View style={styles.header}>
        <ImageBackground
          source={backgroundImage}
          style={styles.footerBackgroundImage}
        ></ImageBackground>
      </View>

      {/* footer */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
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
    marginVertical: 45,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  button2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  loading: {
    width: 70,
    height: 70,
    borderRadius: 25,
    margin: 10,
  },
  headingContainer: {
    fontWeight: '900',
  },
  mainHeading: {
    fontSize: 30,
    fontWeight: '900',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '900',
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
    padding: 10,
  },
  extraText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: 'bold',
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

export default AccountTypeScreen;

// to successfully update the accountType field, we need to update the userData with the signup data
// this means i have to handle login after signup itself and update the userData
