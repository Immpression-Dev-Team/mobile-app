import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { useFonts } from 'expo-font';

const LogoTitle = () => {
    const [loaded] = useFonts({
        BriemHandwriting: require('../assets/fonts/BriemHand-Regular.ttf'),
    });

      // Check if the font is loaded before rendering the component
  if (!loaded) {
    return null;
  }

    return(
        <View>
            <Text style={stylesss.title}>Immpression</Text>
        </View>
    )
}

const stylesss = StyleSheet.create({
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginLeft: 5,
        fontFamily: 'BriemHandwriting'
    },
});

export default LogoTitle