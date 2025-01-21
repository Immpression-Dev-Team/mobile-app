import {
    View,
    Image,
    StyleSheet,
} from "react-native";

export default function SectionBanner({imgLink, bannerHeight}){
    return(
        <View style={[styles.container, { height : `${bannerHeight}%` }]}>
            <Image
                source={imgLink}
                style={styles.banner}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 2.5,
    },
    banner: {
        width: '100%',
        height: '100%',
    }
})