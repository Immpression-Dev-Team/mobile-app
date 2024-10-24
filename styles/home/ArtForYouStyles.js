import { StyleSheet } from "react-native";
import { LEMON_MILK_BOLD_FONT, marginBottom } from "../helper";

export const styles = StyleSheet.create({
    section: {
      marginTop: 6,
      marginBottom: marginBottom(),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 3,
      paddingHorizontal: 5,
    },
    headerText: {
      fontSize: 20,
      color: '#000',
      fontFamily: LEMON_MILK_BOLD_FONT,
    },
    allImageContainer: {
      width: '97%',
      alignSelf: 'center',
      borderWidth: 0,
      borderRadius: 5,
      paddingTop: 0,
      padding: 5,
      position: 'relative',
    },
    column: {
      marginRight: 4,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 4,
      borderRadius: 0,
    },
    overlay: {
      position: 'absolute',
      bottom: 10,
      right: -5,
      width: '60%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    card: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 3,
      paddingHorizontal: 5,
      paddingVertical: 2,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    cardImage: {
      width: 30,
      height: 30,
      marginRight: 5,
      resizeMode: 'contain',
    },
    cardText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
      marginRight: 5,
    },
    loadingContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10,
    },
    loadingSquare: {
      width: 100,
      height: 100,
      backgroundColor: '#d3d3d3',
      margin: 5,
      borderRadius: 5,
    },
  });