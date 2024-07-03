import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginButton = () => {
    const navigation = useNavigation();

    const navigateTo = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <Pressable onPress={() => navigateTo("Login")} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 0,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default LoginButton;
