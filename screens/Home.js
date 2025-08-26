import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../state/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import ArtForYouSection from "../components/home_sections/ArtForYou/ArtForYouSection";
import FeaturedArtistsSection from "../components/home_sections/FeaturedArtists/FeaturedArtistsSection";
import CategoryNavSection from "../components/home_sections/Explore/CategoryNavSection";

import SectionBanner from "../components/home_sections/SectionTemplate/SectionBanner";
import ScreenTemplate from "./Template/ScreenTemplate";

import navBgHeader from "../assets/foryou_assets/background_top.png";
import discoverBgHeader from "../assets/discover_assets/background_top.png";
import discoverBgFooter from "../assets/discover_assets/background_bottom.png";

// import ArtOfTheDay from "../components/home_sections/ArtOfTheDay";
// import InviteFriends from "../components/home_sections/InviteFriends";
// import Categories from "../components/home_sections/Categories";
// import ArtistsPick from "../components/home_sections/ArtistsPick";

export default function HomeScreen() {
  const name = useAuth();
  const navigation = useNavigation();
  // console.log("username: ", name.userData.user.user.name);
  console.log("useAuth response: ", name);

  const handleOrdersPress = () => {
    navigation.navigate('GalleryView', {type: 'orders'});
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* <CategoryNavSection /> */}
        
        <TouchableOpacity style={styles.ordersButtonWrapper} onPress={handleOrdersPress}>
          <LinearGradient
            colors={['#635BFF', '#7C3AED', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ordersButton}
          >
            <Text style={styles.ordersButtonText}>📋 View My Orders</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* <SectionBanner imgLink={navBgHeader} bannerHeight={3} /> */}

        <ArtForYouSection />
        {/* <SectionBanner imgLink={discoverBgHeader} bannerHeight={2} /> */}

        <FeaturedArtistsSection />
        {/* <SectionBanner imgLink={discoverBgFooter} bannerHeight={3.5} /> */}
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
  ordersButtonWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
    width: "90%",
    borderRadius: 16,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ rotate: '-0.5deg' }],
  },
  ordersButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ordersButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
