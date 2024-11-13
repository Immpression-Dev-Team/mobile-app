import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Animated,
    Text,
    Platform
} from "react-native";

const slideLeftGif = require("../../../assets//slideLeft.gif");

export default function ArtForYouContent({ fadeAnim, imageChunks, scrollViewRef, isOverlayVisible, handleScrollEnd, handleImagePress, handleUserActivity }) {
    return(
        <View style={styles.imageContainer}>
            <ScrollView
                horizontal
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleUserActivity}
                onMomentumScrollEnd={handleScrollEnd}
                style={styles.scrollView}
            >
                {imageChunks.map((chunk, chunkIndex) => (
                    <View
                        key={chunkIndex}
                        style={styles.column}
                    >
                        {
                            chunk.map((art, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => handleImagePress(chunkIndex * 2 + index)}
                                    style={styles.imgContainer}
                                >
                                    <Image source={{ uri: art.imageLink }} style={styles.image} />
                                </Pressable>
                            ))
                        }
                    </View>
                ))}
            </ScrollView>

            {isOverlayVisible && (
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <View style={styles.card}>
                        <Image source={slideLeftGif} style={styles.cardImage}/>
                        <Text style={styles.cardText}>Scroll</Text>
                    </View>
                </Animated.View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: '100%',
        padding: '0.75%',
    },
    column: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: (Platform.OS === 'web') ? 200 : 110,
        marginRight: (Platform.OS === 'web') ? 20 : 4,
        gap: (Platform.OS === 'web') ? 20 : 4,
    },
    imgContainer:{
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    overlay: {
        position: "absolute",
        bottom: 10,
        right: -5,
        width: "60%",
        height: 50,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardImage: {
        width: 30,
        height: 30,
        marginRight: 5,
        resizeMode: "contain",
    },
    cardText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
});