// PriceGauge.js

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

const PriceGauge = ({ prices }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={true}
      >
        {prices.map(price => (
          <View key={price} style={styles.priceContainer}>
            <Text style={styles.priceText}>{`$${price}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  priceContainer: {
    width: width / 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  priceText: {
    fontSize: 16,
  },
});

export default PriceGauge;
