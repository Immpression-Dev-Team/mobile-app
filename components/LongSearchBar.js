import React from 'react';
import { View, Pressable, StyleSheet, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LongSearchBar = () => {
  return (
    <View style={styles.main}>
      <TextInput placeholder="Search" style={styles.input} />
      <Pressable style={styles.button}>
        <Icon name="search" size={22} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dee0e3',
    width: '88%',
    height: 40,
    borderRadius: 10,
    left: 0,
    marginHorizontal: 20,
    marginTop: 10,
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
