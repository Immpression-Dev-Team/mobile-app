import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../state/AuthProvider";

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
  console.log("username: ", name.userData.user.user.name);
  console.log("useAuth response: ", name);

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <CategoryNavSection/>
        <SectionBanner imgLink={navBgHeader} bannerHeight={3}/>

        <ArtForYouSection/>
        <SectionBanner imgLink={discoverBgHeader} bannerHeight={3.5}/>

        <FeaturedArtistsSection/>
        <SectionBanner imgLink={discoverBgFooter} bannerHeight={3.5}/>

      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'space-between',
  },
})