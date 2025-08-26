import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
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
                        <Text style={styles.noImage}>No Image</Text>
                    )}
                    <Text style={styles.artistName}>
                        {item?.name?.length > maxLen ? item.name.substring(0, maxLen) + "..." : item.name}
                    </Text>
                    <Text style={styles.artistType}>
                        {item?.artistType || "artistType"}
                    </Text>
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
        height: Platform.OS === "web" ? 300 : 240,
        flexDirection: "row",
        paddingHorizontal: 0,
    },
    artistContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: Platform.OS === "web" ? 160 : 90,
        marginRight: Platform.OS === "web" ? 16 : 0,
        paddingBottom: 20,
    },
    image: {
        width: Platform.OS === "web" ? 140 : 75,
        height: Platform.OS === "web" ? 140 : 75,
        marginBottom: 8,
        borderRadius: 8,
        resizeMode: "cover",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    artistName: {
        fontSize: 10,
        color: "#1F2937",
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 2,
    },
    artistType: {
        fontSize: 8,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "center",
    },
});
