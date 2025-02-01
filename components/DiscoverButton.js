import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const DiscoverButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.optionsIcon}>⋮</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignSelf: 'center',
  },
  optionsIcon: {
    color: '#000', // Icon color
    fontSize: 20, // Font size for the vertical dots
    textAlign: 'center', // Center the dots within the button
    transform: [{ rotate: '0deg' }], // Rotate the "..." to make it vertical
  },
});

export default DiscoverButton;
