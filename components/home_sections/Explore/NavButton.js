import {
    StyleSheet,
    TouchableOpacity,
    Text
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
        borderWidth: 2,
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
        paddingVertical: 6,
        paddingHorizontal: 21,
        borderRadius: 25,
        marginHorizontal: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});