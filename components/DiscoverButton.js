import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DiscoverButton = ({ onPress, isAutoScrolling }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{isAutoScrolling ? '!..' : '...'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginLeft: 57,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 10,
    backgroundColor: '#000',
    borderRadius: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default DiscoverButton;
