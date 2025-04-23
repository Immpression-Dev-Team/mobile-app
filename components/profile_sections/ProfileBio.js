import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileBio = ({ bio }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.bioText}>
        {bio || 'No bio available.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  bioText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default ProfileBio;
