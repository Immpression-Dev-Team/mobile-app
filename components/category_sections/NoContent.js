import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NoContent(){
    const navigation = useNavigation();
    
    return(
        <View style={styles.noContent}>
            <Text style={styles.warningIcon}>!</Text>
            <Text style={styles.warningMsg}>No images yet</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Upload')}
            >
                <Text style={styles.buttonText}>UPLOAD NOW</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    noContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningIcon:{
        fontSize: 127.5,
        color: '#969696',
    },
    warningMsg:{
        fontSize: 22.5,
        fontFamily: 'LEMON MILK Bold',
        color: '#969696',
    },
    button: {
        marginVertical: '7.5%',
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 5,
        borderRadius: 6,
        backgroundColor: '#969696',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
    },
})