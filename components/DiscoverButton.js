import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const DiscoverButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>ALL</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#000', // Button background color
    borderRadius: 3,
    alignSelf: 'center',
    // Shadow properties for iOS
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset of shadow
    shadowOpacity: 0.25, // Opacity of shadow
    shadowRadius: 3.84, // Radius of shadow blur
    // Shadow property for Android
    elevation: 5, // Elevation for Android shadow
  },
  buttonText: {
    color: '#FFF', // Text color
    fontSize: 10, // Font size
    // fontWeight: 'bold',
    fontFamily: 'LEMON MILK Bold',
    textAlign: 'center', // Center text alignment
  },
});

export default DiscoverButton;
