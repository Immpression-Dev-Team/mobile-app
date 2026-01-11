import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../state/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import ArtForYouSection from "../components/home_sections/ArtForYou/ArtForYouSection";
import FeaturedArtistsSection from "../components/home_sections/FeaturedArtists/FeaturedArtistsSection";
import ScreenTemplate from "./Template/ScreenTemplate";

// background assets (still here if you want banners later)
import navBgHeader from "../assets/foryou_assets/background_top.png";
import discoverBgFooter from "../assets/discover_assets/background_bottom.png";

export default function HomeScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();

  const handleOrdersPress = () => {
    navigation.navigate('OrderScreen');
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Top Orders Button - Only show for authenticated users */}
        {token && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.fullButtonWrapper} onPress={handleOrdersPress}>
              <LinearGradient
                colors={['#635BFF', '#7C3AED', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fullButton}
              >
                <Text style={styles.fullButtonText}>📋 Orders</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Sections */}
        <ArtForYouSection />

        <View style={styles.divider} />

        <FeaturedArtistsSection />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    width: "90%",
  },
  fullButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fullButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fullButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    width: '85%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});
