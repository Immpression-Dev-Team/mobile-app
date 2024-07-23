// InviteFriendsRectangle.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundImage from '../../assets/headers/inviteFriends.png';

const InviteFriends = () => {
  return (
    <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage} // Correct usage of the image
          style={styles.rectangle}
        >
          <View style={styles.content}>
            <Text style={styles.text}>Invite your friends to Immpression!</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: '97%',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    width: '97%',
  },
  rectangle: {
    width: '100%',
    alignSelf: 'center',
    height: 100,
    borderRadius: 0,
    padding: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  button: {
    backgroundColor: 'white', // Change to your preferred color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default InviteFriends;
