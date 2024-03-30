import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../components/Navbar'

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      <Text>Statistics</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
});

export default StatisticsScreen;
