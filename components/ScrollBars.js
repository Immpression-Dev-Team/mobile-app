import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const Scrollbars = () => {
  const [price, setPrice] = useState(0);

  return (
    <View style={styles.container}>
      
      <View style={styles.sliderContainer}>
        <Svg height="10" width="100%" style={styles.track}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#002CFF" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#FF00D5" stopOpacity="1" />
              <Stop offset="1" stopColor="#000000" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="10"
            fill="url(#grad)"
            rx="5" // Make the track's corners circular
            ry="5"
          />
        </Svg>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={price}
          onValueChange={(value) => setPrice(value)}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="white"
        />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.rangeText}>$0</Text>
        <Text style={styles.priceText}>{`$${price}`}</Text>
        <Text style={styles.rangeText}>$100</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 24,
    marginBottom: 0,
  },
  sliderContainer: {
    width: '65%', // Adjust width as needed
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, // Make container's corners circular
    overflow: 'hidden',
    position: 'relative',
    marginBottom: -5,
  },
  track: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -5 }],
  },
  slider: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: 14,
  },
});

export default Scrollbars;
