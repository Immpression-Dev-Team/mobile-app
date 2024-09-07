import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MiddleButtons = ({ onCategoriesPress, onTrendingPress }) => {
  return (
    <View style={styles.container}>
      {/* Categories Button */}
      <TouchableOpacity style={styles.button} onPress={onCategoriesPress}>
        <Text style={styles.buttonText}>CATEGORIES</Text>
      </TouchableOpacity>

      {/* Trending Button */}
      <TouchableOpacity style={styles.button} onPress={onTrendingPress}>
        <Text style={styles.buttonText}>TRENDING</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space between the buttons
    paddingHorizontal: 5, // Add horizontal padding
    paddingVertical: 0, // Add vertical padding
  },
  button: {
    flex: 1, // Equal width for both buttons
    backgroundColor: '#000', // Button background color
    paddingVertical: 14, // Vertical padding inside the button
    marginHorizontal: 5, // Space between the buttons
    borderRadius: 6, // Rounded corners
    alignItems: 'center', // Center text horizontally
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (width and height closer to zero for centered shadow)
    shadowOpacity: 0.9, // Shadow opacity increased for a more noticeable shadow
    shadowRadius: 4, // Shadow radius increased for a more blurred shadow effect
    elevation: 8, // Elevation increased for a stronger shadow effect on Android
  },
  buttonText: {
    color: '#FFF', // Text color
    fontSize: 15, // Font size
    // fontWeight: 'bold', // Bold text
    fontFamily: 'LEMON MILK Bold',
  },
});

export default MiddleButtons;
