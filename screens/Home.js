import React from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import Navbar from "../components/Navbar";
import ArtOfTheDay from "../components/home_sections/ArtOfTheDay";
import InviteFriends from "../components/home_sections/InviteFriends";
import Categories from "../components/home_sections/Categories";
import FeaturedArtists from "../components/home_sections/FeaturedArtists";
import ArtistsPick from "../components/home_sections/ArtistsPick";
import FooterNavbar from "../components/FooterNavbar";
import ArtForYou from "../components/home_sections/ArtForYou";
import { useAuth } from "../state/AuthProvider";
import MiddleButtons from "../components/home_sections/MiddleButtons";

import discoverBackgroundBottom from "../assets/discover_assets/background_bottom.png";
import discoverBackgroundTop from "../assets/discover_assets/background_top.png";
import foryouBackgroundBottom from "../assets/foryou_assets/background_bottom.png";
import foryouBackgroundTop from "../assets/foryou_assets/background_top.png";

const HomeScreen = () => {
  const name = useAuth();
  console.log('username: ', name.userData.user.user.name);
  // console.log("useAuth response: ", name);

  return (
    <View style={styles.everything}>
      <View style={styles.navbar}>
        <ImageBackground
          source={require("../assets/backgrounds/navbar_bg_blue.png")}
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Art For You Section */}
        <Image
          source={foryouBackgroundTop}
          style={styles.sectionBackgroundTop}
        />
        <View style={styles.section}>
          <ArtForYou />
        </View>
        <Image
          source={foryouBackgroundBottom}
          style={styles.sectionBackgroundBottom}
        />

        {/* Middle Buttons Section */}
        <MiddleButtons />

        {/* Featured Artists Section */}
        <Image
          source={discoverBackgroundTop}
          style={styles.sectionBackgroundTop}
        />
        <View style={styles.section}>
          <FeaturedArtists />
        </View>
        <Image
          source={discoverBackgroundBottom}
          style={styles.sectionBackgroundBottom}
        />
      </ScrollView>

      <View style={styles.footer}>
        <FooterNavbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  everything: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    zIndex: 1000,
    paddingBottom: 10,
  },
  navbarBackgroundImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  section: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },
  sectionBackgroundTop: {
    width: "100%",
    height: 40,
    resizeMode: "contain",
    marginTop: 5,
  },
  sectionBackgroundBottom: {
    width: "100%",
    height: 40,
    resizeMode: "contain",
    marginBottom: 10,
  },
  footer: {
    zIndex: 1000,
  },
});

export default HomeScreen;
