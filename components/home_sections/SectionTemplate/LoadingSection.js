import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";

import loadingGif from "../../../assets/loading-gif.gif";

export default function LoadingSection({loadingMsg, size}){
    const isMediumSize = size === 'medium';

    return (
        <View style={styles.loadingContainer}>
            <Text
                style={[
                    styles.headerText,
                    { fontSize: (isMediumSize) ? 20 : 25, }
                ]}
            >
                {loadingMsg}
            </Text>
            <Image
                source={loadingGif}
                style={[
                    styles.loadingGif,
                    {
                        width: (isMediumSize) ? 150 : 200,
                        height: (isMediumSize) ? 150 : 200,
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    headerText: {
        fontFamily: 'LEMON MILK Bold',
    },
    loadingGif: {
        resizeMode: "contain",
    },
})