import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { useAuth } from "../state/AuthProvider";

import Navbar from "../components/Navbar";
import navBackground from "../assets/backgrounds/navbar_bg_blue.png";
import FooterNavbar from "../components/FooterNavbar";
import ExploreButtons from "../components/home_sections/Explore/ExploreButtons";
import ArtForYouSection from "../components/home_sections/ArtForYou/ArtForYouSection";
import FeaturedArtistsSection from "../components/home_sections/FeaturedArtists/FeaturedArtistsSection";

// import ArtOfTheDay from "../components/home_sections/ArtOfTheDay";
// import InviteFriends from "../components/home_sections/InviteFriends";
// import Categories from "../components/home_sections/Categories";
// import ArtistsPick from "../components/home_sections/ArtistsPick";

export default function HomeScreen() {
  const name = useAuth();
  console.log("username: ", name.userData.user.user.name);
  console.log("useAuth response: ", name);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <ImageBackground
          source={navBackground}
          style={styles.navbarBackgroundImage}
        >
          <Navbar/>
        </ImageBackground>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ArtForYouSection/>
        <ExploreButtons/>
        <FeaturedArtistsSection/>
      </ScrollView>

      <View style={styles.footer}>
        <FooterNavbar/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  navbar: {
    width: "100%",
    height: (Platform.OS === 'web') ? "10%" : "15%",
    zIndex: 1000,
  },
  navbarBackgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'space-between',
  },
  footer: {
    zIndex: 1000,
  },
})