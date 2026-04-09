import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    View,
    Platform,
} from "react-native";

export default function FeaturedArtistsContent({ artists = [], navigate }) { // Default to an empty array
    const maxLen = 10;

    if (!artists || artists.length === 0) {
        return <Text style={styles.noArtists}>No featured artists available.</Text>;
    }

    return (
        <ScrollView
            horizontal
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
        >
            {artists.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.artistContainer}
                    onPress={() =>
                        navigate(
                            item?.name || "Unknown",
                            item?.profilePictureLink || "",
                            item?.artistType || "artistType",
                            index,
                            item?._id || ""
                        )
                    }
                >
                    {item?.profilePictureLink ? (
                        <Image
                            source={{ uri: item.profilePictureLink }}
                            style={styles.image}
                        />
                    ) : (
                        <View style={styles.imageFallback} />
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    noArtists: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginTop: 20,
    },
    noImage: {
        fontSize: 12,
        color: "gray",
        textAlign: "center",
    },
    scrollView: {
        height: Platform.OS === "web" ? 120 : 68,
        flexDirection: "row",
        paddingHorizontal: 0,
    },
    artistContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: Platform.OS === "web" ? 80 : 64,
        marginRight: Platform.OS === "web" ? 12 : 0,
    },
    image: {
        width: Platform.OS === "web" ? 64 : 54,
        height: Platform.OS === "web" ? 64 : 54,
        borderRadius: 0,
        resizeMode: "cover",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    imageFallback: {
        width: Platform.OS === "web" ? 64 : 54,
        height: Platform.OS === "web" ? 64 : 54,
        borderRadius: 0,
        backgroundColor: "#E5E7EB",
    },
});
