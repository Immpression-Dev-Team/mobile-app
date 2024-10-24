import { marginBottom20 } from "../helper";

export const styles = StyleSheet.create({
    gradientContainer: {
      width: '97%',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: marginBottom20(),
    },
    container: {
      width: '97%',
    },
    rectangle: {
      width: '100%',
      alignSelf: 'center',
      height: 100,
      borderRadius: 0,
      padding: 0,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 10,
    },
    text: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
      position: 'absolute',
      top: 10,
      left: 10,
    },
    button: {
      backgroundColor: 'white', // Change to your preferred color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    buttonText: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });