import { useFonts } from "expo-font";

export default function FontLoader(){
    const [fontsLoaded] = useFonts({
        "BriemHand-Black": require('../assets/fonts/BriemHand-Black.ttf'),
        "BriemHand-Bold": require('../assets/fonts/BriemHand-Bold.ttf'),
        "BriemHand-Medium": require('../assets/fonts/BriemHand-Medium.ttf'),
        "BriemHand-Regular": require('../assets/fonts/BriemHand-Regular.ttf'),
        "LEMON MILK Bold": require('../assets/fonts/LEMONMILK-Bold.otf'),
    });

    return fontsLoaded
};