import { StyleSheet } from "react-native";
import { marginBottom20 } from "../helper";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: marginBottom20(), 
    },
    quoteText: {
      fontSize: 15,
      textAlign: 'left', // Align text to the left
      fontStyle: 'italic',
      marginHorizontal: 20,
    },
  });