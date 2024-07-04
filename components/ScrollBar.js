import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const SimpleCenteredSlider = () => {
  const [price, setPrice] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.priceText}>{`$${price}`}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={price}
        onValueChange={(value) => setPrice(value)}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  priceText: {
    fontSize: 24,
    marginBottom: 20,
  },
  slider: {
    width: '80%', // Adjust width as needed
  },
});

export default SimpleCenteredSlider;
