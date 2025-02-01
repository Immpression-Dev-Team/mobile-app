import {
    View,
    StyleSheet,
    ImageBackground,
    Platform,
} from "react-native";

import Navbar from "../../components/Navbar";
import navBackground from "../../assets/backgrounds/navbar_bg_blue.png";
import FooterNavbar from "../../components/FooterNavbar";

export default function ScreenTemplate({children}) {
    return (
        <View style={styles.container}>
            {/* render nav bar */}
            <View style={styles.navbar}>
                <ImageBackground
                    source={navBackground}
                    style={styles.navbarBackgroundImage}
                >
                    <Navbar/>
                </ImageBackground>
            </View>
            
            {/* render screen content */}
            <View style={styles.children}>
                { children }
            </View>

            {/* render footer nav bar */}
            <View style={styles.footer}>
                <FooterNavbar/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    navbar: {
        zIndex: 1000,
        width: "100%",
        height: (Platform.OS === 'web') ? "10%" : "15%",
    },
    navbarBackgroundImage: {
        width: "100%",
        height: "90%",
        resizeMode: "cover",
        justifyContent: 'flex-end',
    },
    footer: {
        zIndex: 1000,
        width: "100%",
        height: "11%",
    },
    children: {
        flex: 1,
    }
})