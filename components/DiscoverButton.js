import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const DiscoverButton = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.filterIcon}>🔍</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterIcon: {
    color: '#4B5563',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DiscoverButton;
