import {
    View,
    StyleSheet,
    Image,
} from "react-native";

import forYouBgHeader from "../../../assets/foryou_assets/background_top.png";
import forYouBgFooter from "../../../assets/foryou_assets/background_bottom.png";

import discoverBgHeader from "../../../assets/discover_assets/background_top.png";
import discoverBgFooter from "../../../assets/discover_assets/background_bottom.png";

export default function SectionTemplate({sectionName, renderSection, height, headerHeight, footerHeight}) {
    return(
        <View
            style={[
                styles.sectionContainer,
                (height) ? { height: `${height}%` } : { flex: 1 }
            ]}
        >
            <Image
                source={sectionName === 'ArtForYou'? forYouBgHeader : discoverBgHeader}
                style={[
                    styles.bgHeader,
                    (headerHeight) ? { height: `${headerHeight}%` } : {}
                ]}
            />
            <View style={styles.viewContainer}>
                {
                    renderSection
                }
            </View>
            <Image
                source={sectionName === 'ArtForYou'? forYouBgFooter : discoverBgFooter}
                style={[
                    styles.bgFooter,
                    (footerHeight) ? { height: `${footerHeight}%` } : {}
                ]}
            />
        </View>
    )
}
  
const styles = StyleSheet.create({
    sectionContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    viewContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: 'center',
    },
    bgHeader: {
        height: "9%",
        width: "100%",
        resizeMode: "cover",
    },
    bgFooter: {
        height: "8.5%",
        width: "100%",
        resizeMode: "cover",
    },
})