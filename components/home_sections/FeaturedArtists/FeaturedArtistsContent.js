import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    Platform,
} from "react-native";

export default function FeaturedArtistsContent({artists, navigate}) {
    // truncated if the username is too long
    const maxLen = 10;

    return(
        <ScrollView
            horizontal
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
        >
            {artists?.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.artistContainer}
                    onPress={() =>
                        navigate(
                            item.name,
                            item.profilePictureLink,
                            item.artistType,
                            index,
                            item._id // Assuming `_id` is the user's unique identifier
                        )
                    }
                >
                    <Image
                        source={{ uri: item.profilePictureLink }}
                        style={styles.image}
                    />
                    <Text style={styles.artistName}>{
                        (item.name.length > maxLen) ? item.name.substring(0, maxLen) + "..." :
                        item.name
                    }</Text>
                    <Text style={styles.artistType}>{(item.artistType)? item.artistType : 'artistType'}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: '0.75%',
    },
    artistContainer: {
        flexDirection: 'column',
        textAlign: 'left',
        justifyContent: 'flex-end',
        width: (Platform.OS === 'web') ? 200 : 95,
        marginRight: (Platform.OS === 'web') ? 20 : 2.5,
    },
    image: {
        width: '100%',
        height: '67.5%',
        marginBottom: '5%',
        borderRadius: 0,
        resizeMode: 'cover',
        borderColor: 'black',
        borderWidth: 1,
    },
    artistName: {
        fontSize: 10,
        color: "black",
        fontFamily: "LEMON MILK Bold",
    },
    artistType: {
        fontSize: 9,
        color: "black",
        fontWeight: "bold",
    },
});