import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileArtistType = ({ artistType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.artistTypeText}>
        {artistType || 'No artist type selected.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  artistTypeText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});

export default ProfileArtistType;
