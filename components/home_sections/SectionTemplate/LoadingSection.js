import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoadingSection({ loadingMsg, size }) {
  const isMediumSize = size === "medium";

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#635BFF" style={styles.spinner} />
      <Text style={[styles.headerText, { fontSize: isMediumSize ? 16 : 18 }]}>
        {loadingMsg}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .3)",
  },
  headerText: {
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    letterSpacing: 0.5,
  },
  spinner: {
    marginBottom: 8,
  },
});
