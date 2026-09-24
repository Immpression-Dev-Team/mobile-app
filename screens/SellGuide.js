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

const SellGuide = ({ route }) => {
    const navigation = useNavigation();
    const fulfillmentType = route?.params?.fulfillmentType;
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

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
                        onPress={() => navigation.navigate("Upload", { fulfillmentType })}
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
        flex: 1,
        padding: 16,
        alignItems: "center",
    },
    innerContainer: {
        // borderRadius: 14,
        flex: 1,
        padding: 16,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    backButton: { alignSelf: "flex-start", marginBottom: 2 },
    backText: { color: "#007bff", fontSize: 16, fontWeight: "500" },
    title: {
        fontSize: 19,
        fontWeight: "bold",
        marginVertical: 6,
        color: "#1E2A3A",
        textAlign: "center",
        width: "100%",
    },
    imageContainer: {
        width: Dimensions.get("window").width * 0.8,
        height: 170,
        // borderRadius: 10,
        overflow: "hidden",
        marginVertical: 12,
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
        fontSize: 15,
        fontWeight: "600",
        color: "#2C3E50",
        marginBottom: 6,
        textAlign: "center",
    },
    bulletWrapper: {
        width: '100%',
        gap: 6,
        marginTop: 8,
        marginBottom: 14,
      },
      bulletCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        // borderRadius: 8,
        paddingVertical: 5,
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
        paddingVertical: 12,
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
