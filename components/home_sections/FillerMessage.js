import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FillerMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.quoteText}>"We are the music makers, and we are the dreamers of dreams"</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        dualborderColor1: 'red',
        dualborderColor2: 'blue',
        borderRadius: 0,
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginBottom: 20,
    },
    quoteText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'left',
        // fontWeight: 'bold',
    },
});

export default FillerMessage;
