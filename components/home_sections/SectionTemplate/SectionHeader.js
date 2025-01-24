import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import DiscoverButton from "../../DiscoverButton";

export default function SectionHeader({headerText}){
    return(
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                {headerText}
            </Text>
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
        marginBottom: '0%',
        paddingHorizontal: '1%',
    },
    headerText: {
        fontSize: 20,
        fontFamily: "LEMON MILK Bold",
    },
})