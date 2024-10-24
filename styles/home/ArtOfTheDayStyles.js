import { StyleSheet } from "react-native";
import { headerContainer } from "../helper";

export const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 0,
    },
    headerContainer: headerContainer(0,null,0),
    headerImage: {
        width: 274, // Adjust width according to your image
        height: 52, // Adjust height according to your image
        resizeMode: 'contain',
    },
    contentContainer: {
        flexDirection: 'row', // Align the image and text side by side
        alignItems: 'center',
        marginTop: 0,
    },
    artImage: {
        width: 150, // Adjust size as needed
        height: 150,
        borderRadius: 0,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    artTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    artistName: {
        fontSize: 16,
        color: '#888',
    },
    artPrice: {
        fontSize: 14
    }
});