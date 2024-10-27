import { StyleSheet } from "react-native";
import { headerContainer, LEMON_MILK_BOLD_FONT } from "../helper";

export const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingVertical: 0,
    },
    headerContainer: headerContainer(2,0),
    headerText: {
      fontSize: 20,
      fontFamily: LEMON_MILK_BOLD_FONT,
      color: '#000',
    },
    scrollView: {
      flexDirection: 'row',
    },
    artistContainer: {
      alignItems: 'left',
      marginRight: 3,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 2,
    },
    artistName: {
      fontSize: 8,
      color: 'black',
      fontFamily: LEMON_MILK_BOLD_FONT,
    },
    artistType: {
      fontSize: 8,
      color: 'black',
      fontWeight: 'bold',
    },
  });