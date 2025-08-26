import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import DiscoverButton from "../../DiscoverButton";

export default function FeaturedArtistsHeader(){
    return(
        <View style={styles.headerContainer}>
            <View style={styles.titleSection}>
                <Text style={styles.headerText}>
                    Discover Artists
                </Text>
                <Text style={styles.subtitle}>
                    Explore talented creators in our community
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
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    titleSection: {
        flex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
    },
})