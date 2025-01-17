import {
    View,
    StyleSheet,
    Image,
} from "react-native";

import navBgHeader from "../../../assets/foryou_assets/background_top.png";
import navBgFooter from "../../../assets/foryou_assets/background_bottom.png";

import discoverBgHeader from "../../../assets/discover_assets/background_top.png";
import discoverBgFooter from "../../../assets/discover_assets/background_bottom.png";

export default function SectionTemplate({sectionName, renderSection, height=null, headerHeight=null, footerHeight=null}) {
    // a section may or may not include top & bottom banner
    const hasBanner = headerHeight && footerHeight;
    const RenderBanner = ({ imgLink, style, height }) => {
        if (!hasBanner)
            return null;

        return (
          <Image
            source={imgLink}
            style={[style, { height: `${height}%` }]}
          />
        );
      };

    return(
        <View
            style={[
                styles.sectionContainer,
                (height) ? { height: `${height}%` } : { flex: 1 }
            ]}
        >
            {/* render banner header if required */}
            <RenderBanner 
                imgLink={sectionName === 'CategoryNavBar' ? navBgHeader : discoverBgHeader} 
                style={styles.bgHeader} 
                height={headerHeight} 
            />

            {/* render section content */}
            <View style={[styles.viewContainer, { marginVertical: (!hasBanner) ?  12.5 : 0 }]}>
                {
                    renderSection
                }
            </View>

            {/* render footer header if required */}
            <RenderBanner 
                imgLink={sectionName === 'CategoryNavBar' ? navBgFooter : discoverBgFooter} 
                style={styles.bgFooter} 
                height={footerHeight} 
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