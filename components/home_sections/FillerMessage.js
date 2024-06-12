import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FillerMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.quoteText}>Redefining and reintroducing real art for all individuals.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '96%',
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: 'black',
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
