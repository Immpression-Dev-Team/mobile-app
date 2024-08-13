import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the MaterialCommunityIcons icon set

const TVButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Icon 
        name="television-classic" // Updated TV icon name in MaterialCommunityIcons
        size={30} // Adjust the size of the icon as needed
        color="#000" // Set the color of the icon
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 0,
    marginLeft: 55,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 0,
    alignSelf: 'center',
  },
});

export default TVButton;
