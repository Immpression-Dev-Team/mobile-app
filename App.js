import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text>Welcome to Immpression</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
