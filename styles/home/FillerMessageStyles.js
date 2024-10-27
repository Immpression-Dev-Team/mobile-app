import { StyleSheet } from "react-native";
import { marginBottom20 } from "../helper";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderLeftColor: 'red',
        borderRightColor: 'blue',
        borderRadius: 0,
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        marginBottom: marginBottom20(),
    },
    quoteText: {
        fontSize: 16,
        color: 'purple',
        textAlign: 'left',
        fontWeight: 'bold',
        // fontWeight: 'bold',
    },
});