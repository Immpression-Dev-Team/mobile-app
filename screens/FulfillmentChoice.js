import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ScreenTemplate from "./Template/ScreenTemplate";

const OPTIONS = [
  {
    value: "seller",
    title: "Physical Artwork",
    subtitle: "I already have the physical artwork, and will ship it when sold.",
    icon: "photo-library",
    colors: ["#FBBF24", "#D97706"],
  },
  {
    value: "print_on_demand",
    title: "Print on Demand",
    subtitle: "This is digital artwork. Immpression will print and ship it when someone buys it.",
    icon: "print",
    colors: ["#007bff", "#0056d2"],
  },
];

const OptionCard = ({ option, onPress, shineTranslate }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.iconOuter}>
      <LinearGradient colors={option.colors} style={styles.iconGradient}>
        <Icon name={option.icon} size={36} color="#fff" />
      </LinearGradient>
      <Animated.View
        pointerEvents="none"
        style={[styles.shine, { transform: [{ translateX: shineTranslate }, { rotate: "20deg" }] }]}
      />
    </View>

    <View style={styles.textWrap}>
      <Text style={styles.cardTitle}>{option.title}</Text>
      <Text style={styles.cardDesc}>{option.subtitle}</Text>
    </View>

    <Icon name="chevron-right" size={28} color="#B9C2D0" />
  </TouchableOpacity>
);

const FulfillmentChoice = () => {
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
    outputRange: [-45, 90],
  });

  const choose = (fulfillmentType) => {
    if (fulfillmentType === "seller") {
      navigation.navigate("SellGuide", { fulfillmentType });
    } else {
      navigation.navigate("Upload", { fulfillmentType });
    }
  };

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

          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            How Will This Artwork Be Delivered?
          </Text>

          <View style={styles.cardWrapper}>
            {OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                onPress={() => choose(option.value)}
                shineTranslate={shineTranslate}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, padding: 20 },
  backButton: { alignSelf: "flex-start", marginBottom: 4 },
  backText: { color: "#007bff", fontSize: 16, fontWeight: "500" },
  innerContainer: {
    flex: 1,
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
  cardWrapper: {
    flex: 1,
    width: "100%",
    gap: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
    overflow: "hidden",
  },
  iconGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shine: {
    position: "absolute",
    top: -24,
    left: 0,
    width: 20,
    height: 120, // taller than the circle so the rotated band never clips at the top/bottom
    backgroundColor: "white",
    opacity: 0.35,
  },
  textWrap: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#1E2A3A", marginBottom: 5 },
  cardDesc: { fontSize: 14, color: "#5A6472", lineHeight: 19 },
});

export default FulfillmentChoice;
