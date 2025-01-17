import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../state/AuthProvider";

import ArtForYouSection from "../components/home_sections/ArtForYou/ArtForYouSection";
import FeaturedArtistsSection from "../components/home_sections/FeaturedArtists/FeaturedArtistsSection";
import ScreenTemplate from "./ScreenTemplate";
import CategoryNavSection from "../components/home_sections/Explore/CategoryNavSection";

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
        <ArtForYouSection/>
        <FeaturedArtistsSection/>
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