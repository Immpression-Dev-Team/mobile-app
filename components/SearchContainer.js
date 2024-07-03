import React from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchContainer = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.main}>
        <TextInput placeholder="Search" style={styles.input} />
        <Pressable style={styles.button} onPress={onClose}>
          <Icon name="search" size={22} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 98,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray overlay
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 245,
    height: 45,
    borderRadius: 10,
    marginRight: 5,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    marginTop: 0,
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchContainer;
