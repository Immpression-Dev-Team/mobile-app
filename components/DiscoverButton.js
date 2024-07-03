import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const DiscoverButton = ({ onPress, isAutoScrolling }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{isAutoScrolling ? '!..' : '...'}</Text>
    </Pressable>
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
