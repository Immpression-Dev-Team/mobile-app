import { headerContainer, marginBottom } from "../helper";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 0,
        padding: 0,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        marginBottom: marginBottom(),
        marginTop: 20,
    },
    backgroundImage: {
        width: '97%',
    },
    backgroundImageStyle: {
        resizeMode: 'cover',
        borderRadius: 0,
    },
    gradient: {
        flex: 1,
        borderRadius: 0,
    },
    section: {
        width: '97%',
        alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#aebacf',
        borderRadius: 0,
        padding: 20,
        marginBottom: 0,
        paddingBottom: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    headerContainer: headerContainer(2,null,7),
    headerImage: {
        width: 200, // Adjust width according to your image
        height: 50, // Adjust height according to your image
        resizeMode: 'contain',
    },
    rightHeader: {
        marginLeft: 'auto',
        marginRight: 10,
    },
    scrollView: {
        flexDirection: 'row',
    },
    imageContainer: {
        marginRight: 4,
        alignItems: 'flex-start',
    },
    imageWrapper: {
        position: 'relative',
        width: 110,
        height: 110,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    profilePicContainer: {
        position: 'absolute',
        bottom: -20,
        right: 15,
        width: 55,
        height: 55,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#5D9177',
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    imageTitle: {
        marginTop: 20,
        marginLeft: 7,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    artistName: {
        marginLeft: 7,
        textAlign: 'left',
        color: 'gray',
    },
});