import { StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "../state/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import ArtForYouSection from "../components/home_sections/ArtForYou/ArtForYouSection";
import FeaturedArtistsSection from "../components/home_sections/FeaturedArtists/FeaturedArtistsSection";
import PublicDomainArtSection from "../components/home_sections/PublicDomainArt/PublicDomainArtSection";
import HomeSearchResults from "../components/HomeSearchResults";
import HomeBannerAd from "../components/HomeBannerAd";
import ScreenTemplate from "./Template/ScreenTemplate";

// background assets (still here if you want banners later)
import navBgHeader from "../assets/foryou_assets/background_top.png";
import discoverBgFooter from "../assets/discover_assets/background_bottom.png";

export default function HomeScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleOrdersPress = () => {
    navigation.navigate('OrderScreen');
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Top Orders Button + Search - Only show for authenticated users */}
        {token && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.ordersButtonWrapper} onPress={handleOrdersPress}>
              <LinearGradient
                colors={['#635BFF', '#7C3AED', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ordersButton}
              >
                <Text style={styles.ordersButtonText}>📋 Orders</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search art, artists..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        )}

        {/* Main Content — sections or search results */}
        {searchQuery.trim() ? (
          <HomeSearchResults searchQuery={searchQuery} />
        ) : (
          <>
            <ArtForYouSection />

            <HomeBannerAd />

            <View style={styles.divider} />

            <FeaturedArtistsSection />

            <HomeBannerAd />

            <View style={styles.divider} />

            <PublicDomainArtSection />
          </>
        )}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
    gap: 8,
  },
  ordersButtonWrapper: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ordersButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ordersButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  divider: {
    width: '85%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});
