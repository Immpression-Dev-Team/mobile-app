import { StyleSheet } from "react-native";
import { headerContainer } from "../helper";

export const styles = StyleSheet.create({
    section: {
        width: '98%',
        marginTop: 30,
    },
    headerContainer: headerContainer(null,null,5),
    headerImage: {
        width: 264,
        height: 52,
        resizeMode: 'contain',
        marginBottom: -3,
    },
    rightHeader: {
        marginLeft: 'auto', // Pushes the TV button to the right
        marginRight: 10,
    },
    mainContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center', // Align all items to the center
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    box: {
        width: '48%',
        height: 100,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    image: {
        // borderRadius: 10,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});