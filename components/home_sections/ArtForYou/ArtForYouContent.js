import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Animated,
    Platform,
} from "react-native";

const slideLeftGif = require("../../../assets//slideLeft.gif");

export default function ArtForYouContent({
    fadeAnim,
    imageChunks,
    scrollViewRef,
    isOverlayVisible,
    handleScrollEnd,
    handleImagePress,
    handleUserActivity,
}) {
    useEffect(() => {
        if (isOverlayVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1, // Fully visible
                duration: 500, // Duration of the fade-in
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0, // Fully hidden
                duration: 500, // Duration of the fade-out
                useNativeDriver: true,
            }).start();
        }
    }, [isOverlayVisible]);


    return (
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
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((art, index) => (
                            <Pressable
                                key={index}
                                onPress={() =>
                                    handleImagePress(chunkIndex * 2 + index)
                                }
                                style={styles.imgContainer}
                            >
                                <Image
                                    source={{ uri: art.imageLink }}
                                    style={styles.image}
                                />
                            </Pressable>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {isOverlayVisible && (
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <Animated.View
                        style={[
                            styles.gifContainer,
                            { opacity: fadeAnim }, // Apply fade-in to the GIF as well
                        ]}
                    >
                        <Image source={slideLeftGif} style={styles.cardImage} />
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: "100%",
        padding: "0.75%",
    },
    column: {
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        width: Platform.OS === "web" ? 200 : 110,
        marginRight: Platform.OS === "web" ? 20 : 4,
        gap: Platform.OS === "web" ? 20 : 4,
    },
    imgContainer: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 0,
        borderColor: "black",
        borderWidth: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.31)", // Dark semi-transparent background
        justifyContent: "center",
    },
    gifContainer: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 10,
        top: "50%",
        right: 10, // Positions the GIF on the right side
        transform: [{ translateY: -25 }], // Centers the GIF vertically
    },
    cardImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
});
