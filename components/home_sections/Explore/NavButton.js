import {
    StyleSheet, TouchableOpacity, Text
} from 'react-native';

export default function NavButton({btnText, handler}) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handler}
        >
            <Text style={styles.buttonText}>
                {btnText}
            </Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: 55,
        borderRadius: 5,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 }, // Shadow offset (width and height closer to zero for centered shadow)
        elevation: 8, // Elevation increased for a stronger shadow effect on Android
  },
    buttonText: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: 'LEMON MILK Bold',
    },
});