import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LongSearchBar = () => {
  return (
    <View style={styles.main}>
      <TextInput placeholder="Search" style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Icon name="search" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dee0e3',
    width: 350,
    height: 45,
    borderRadius: 10,
    left: 5,
    marginHorizontal: 15,
    marginBottom: 15,
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

export default LongSearchBar;
