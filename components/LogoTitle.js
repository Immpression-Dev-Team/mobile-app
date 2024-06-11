import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';

const LogoTitle = () => {
    return(
        <View>
            <Text style={stylesss.title}>Immpression</Text>
        </View>
    )
}

const stylesss = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'blue',
        fontStyle: 'italic',
        

    },
});

export default LogoTitle