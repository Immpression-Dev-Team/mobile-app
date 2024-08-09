import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the MaterialCommunityIcons icon set

const DiscoverButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Icon 
        name="arrow-expand" // Diagonal both-sided arrow icon name in MaterialCommunityIcons
        size={24} // Adjust the size of the icon as needed
        color="#000" // Set the color of the icon
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 5,
    marginLeft: 57,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    // backgroundColor: '#000',
    borderRadius: 15,
    alignSelf: 'center',
  },
});

export default DiscoverButton;
