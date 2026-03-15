import { View, Text, StyleSheet } from "react-native";

export default function PublicDomainArtHeader() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleSection}>
        <Text style={styles.headerText}>Public Domain Art</Text>
        <Text style={styles.subtitle}>Masterpieces from the world's greatest museums</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  titleSection: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
});
