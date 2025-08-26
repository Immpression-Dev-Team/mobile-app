import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import DiscoverButton from "../../DiscoverButton";

export default function ArtForYouHeader(){
    return(
        <View style={styles.headerContainer}>
            <View style={styles.titleSection}>
                <View style={styles.paintedTitleWrapper}>
                    {/* <Image
                        source={require('../../../assets/orange-paint.png')}
                        style={styles.paintBackground}
                        resizeMode="contain"
                    /> */}
                    <Text style={styles.headerText}>
                        Art For You
                    </Text>
                </View>
                <Text style={styles.subtitle}>
                    Curated artwork just for you
                </Text>
            </View>
            <DiscoverButton/>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(99, 91, 255, 0.2)',
    },
    titleSection: {
        flex: 1,
    },
    paintedTitleWrapper: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    paintBackground: {
        position: 'absolute',
        top: -15,
        left: -30,
        right: -30,
        bottom: -15,
        width: undefined,
        height: undefined,
        transform: [{ rotate: '-1deg' }, { scaleX: 1.8 }],
        opacity: 0.6,
        zIndex: -1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(99, 91, 255, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
        fontStyle: 'italic',
        marginTop: 2,
        marginLeft: 4,
    },
})