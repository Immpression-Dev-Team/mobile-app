import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const PriceSliders = () => {
  const [bidPrice, setBidPrice] = useState(0);

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Bid Price: ${bidPrice.toFixed(2)}
      </Text>
      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={0}
        maximumValue={105}
        step={1}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#4CAF50"
        value={bidPrice}
        onValueChange={(value) => setBidPrice(value)}
      />
    </View>
  )
}

export default PriceSliders

const styles = StyleSheet.create({})