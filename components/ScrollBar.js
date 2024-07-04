import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const SimpleCenteredSlider = () => {
  const [price, setPrice] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.priceText}>{`$${price}`}</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.track} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={price}
          onValueChange={(value) => setPrice(value)}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          thumbTintColor="#1EB1FC"
        />
      </View>
      <Text style={styles.rangeText}>0 - 100</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  priceText: {
    fontSize: 24,
    marginBottom: 10,
  },
  sliderContainer: {
    width: '80%', // Adjust width as needed
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, // Make container's corners circular
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 10, // Adjust the thickness of the track
    backgroundColor: 'black',
    borderRadius: 5, // Make the track's corners circular
    transform: [{ translateY: -5 }],
  },
  slider: {
    width: '100%',
    height: '100%',
  },
  rangeText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SimpleCenteredSlider;
