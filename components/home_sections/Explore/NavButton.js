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
        height: '100%',
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#000',
        backgroundColor: '#007AFF',
        paddingVertical: '1%',
        paddingHorizontal: '3.5%',
        marginHorizontal: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});