import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/home/FillerMessageStyles';

const FillerMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.quoteText}>"We are the music makers, and we are the dreamers of dreams"</Text>
        </View>
    );
};

export default FillerMessage;
