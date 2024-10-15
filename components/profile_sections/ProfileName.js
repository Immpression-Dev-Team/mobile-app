import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileName = ({ name }) => {
  return (
    <View>
      <Text style={styles.profileName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileName: {
    fontSize: 24,
    bottom: -20,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },
});

export default ProfileName;
