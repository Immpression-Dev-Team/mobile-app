import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenTemplate from "./Template/ScreenTemplate";
import { LinearGradient } from "expo-linear-gradient";


const screenWidth = Dimensions.get('window').width;

const SellGuide = () => {
    const navigation = useNavigation();
    const shineAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shineAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, [shineAnim]);

    const shineTranslate = shineAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-300, 300],
    });

    return (
        <ScreenTemplate>
            <View style={styles.outerContainer}>
                <LinearGradient
                    colors={["#bfd4f5", "#F5F9FF"]}
                    style={styles.innerContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="clip">
                        How to Photograph Your Artwork
                    </Text>


                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../assets/sample1.png")}
                            style={styles.guideImage}
                        />
                        <Animated.View
                            style={[styles.shine, { transform: [{ translateX: shineTranslate }] }]}
                        />
                    </View>

                    <Text style={styles.instructions}>Make sure your photo is:</Text>

                    <View style={styles.bulletWrapper}>
                        <View style={styles.bulletCard}>
                            <Text style={styles.bulletIcon}>📸</Text>
                            <Text style={styles.bulletText}>Use natural lighting</Text>
                        </View>
                        <View style={styles.bulletCard}>
                            <Text style={styles.bulletIcon}>🖼️</Text>
                            <Text style={styles.bulletText}>Capture the full artwork</Text>
                        </View>
                        <View style={styles.bulletCard}>
                            <Text style={styles.bulletIcon}>✂️</Text>
                            <Text style={styles.bulletText}>Avoid cropping or cutoff</Text>
                        </View>
                        <View style={styles.bulletCard}>
                            <Text style={styles.bulletIcon}>🚫</Text>
                            <Text style={styles.bulletText}>Keep background distraction-free</Text>
                        </View>
                    </View>



                    <TouchableOpacity
                        style={styles.continueButtonWrapper}
                        onPress={() => navigation.navigate("Upload")}
                    >
                        <LinearGradient colors={["#007bff", "#0056d2"]} style={styles.continueButton}>
                            <Text style={styles.continueText}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </ScreenTemplate>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    innerContainer: {
        // borderRadius: 14,
        padding: 20,
        width: "100%",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#1E2A3A",
        textAlign: "center",
        width: "100%",
    },
    imageContainer: {
        width: Dimensions.get("window").width * 0.8,
        height: 220,
        // borderRadius: 10,
        overflow: "hidden",
        marginVertical: 20,
        position: "relative",
    },
    guideImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        // borderRadius: 10,
    },
    shine: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 80,
        height: "100%",
        backgroundColor: "white",
        opacity: 0.25,
        transform: [{ rotate: "20deg" }],
        zIndex: 2,
    },
    instructions: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 10,
        textAlign: "center",
    },
    bulletWrapper: {
        width: '100%',
        gap: 8,
        marginTop: 12,
        marginBottom: 24,
      },
      bulletCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        // borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        width: screenWidth * 0.80, // responsive width
        alignSelf: 'center',
    
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      bulletIcon: {
        fontSize: 18,
        marginRight: 10,
      },
      bulletText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2C3E50',
        flexShrink: 1,
      },

    continueButtonWrapper: {
        width: "100%",
        borderRadius: 6,
        overflow: "hidden",
        elevation: 2,
    },
    continueButton: {
        paddingVertical: 14,
        alignItems: "center",
    },
    continueText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default SellGuide;
