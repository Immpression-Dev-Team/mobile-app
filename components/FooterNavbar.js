import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FooterNavbar = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../assets/backgrounds/footer-bg.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/icons/Home.png')} style={styles.icon} />
          {/* <Text style={styles.text}>Home</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Upload')}>
          <Image source={require('../assets/icons/Upload.png')} style={styles.icon} />
          {/* <Text style={styles.text}>Upload</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Image source={require('../assets/icons/Profile.png')} style={styles.icon} />
          {/* <Text style={styles.text}>Profile</Text> */}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 70,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent', // Set backgroundColor to transparent
    borderTopWidth: 0.2,
    borderTopColor: '#ADBBD6',
    paddingBottom: 20,
    paddingHorizontal: 35,
  },
  button: {
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 12,
    marginTop: 4,
  },
  icon: {
    width: 50, // Set the width as needed
    height: 50, // Set the height as needed
    resizeMode: 'contain', // Ensure the icon scales correctly
  }
});

export default FooterNavbar;
