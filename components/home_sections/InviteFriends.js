// InviteFriendsRectangle.js
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundImage from '../../assets/headers/inviteFriends.png';
import { styles } from '../../styles/home/InviteFriendsStyles';

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

export default InviteFriends;
