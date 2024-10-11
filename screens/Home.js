import React from "react";
import { View, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";
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

import discoverBackgroundBottom from '../assets/discover_assets/background_bottom.png';
import discoverBackgroundTop from '../assets/discover_assets/background_top.png';
import foryouBackgroundBottom from '../assets/foryou_assets/background_bottom.png';
import foryouBackgroundTop from '../assets/foryou_assets/background_top.png';

const HomeScreen = () => {
  const name = useAuth();
  console.log("username: ", name.userData.user.user.name);
  console.log("useAuth response: ", name);

  return (
    <View style={styles.everything}>
      <View style={styles.navbar}>
        <ImageBackground
          source={require("../assets/backgrounds/navbar-bg3.png")} // Replace with your image path
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>
      </View>
      <View style={styles.container}>
        <Image source={foryouBackgroundTop} style={styles.foryouBackgroundTopImage} />
        <ArtForYou />
        <Image source={foryouBackgroundBottom} style={styles.foryouBackgroundBottomImage} />

        <MiddleButtons />

        <Image source={discoverBackgroundTop} style={styles.discoverBackgroundTopImage} />
        <FeaturedArtists />
        <Image source={discoverBackgroundBottom} style={styles.discoverBackgroundBottomImage} />
      </View>
      <View style={styles.footer}>
        <FooterNavbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarBackgroundImage: {
    width: "100%",
    height: 80, // Adjust this value to match the height of your navbar
    resizeMode: 'cover', // Ensures the image covers the area of the navbar
  },
  everything: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginTop: 35, // Add margin to create space between the navbar and the content
    paddingBottom: 10,
    paddingHorizontal: 0,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  navbar: {
    zIndex: 1000,
    paddingBottom: 10,
  },
  footer: {
    zIndex: 1000,
  },
  discoverBackgroundBottomImage: {
    width: '97.5%',
    height: 50,
    resizeMode: 'contain',
    marginTop: -400,
  },
  discoverBackgroundTopImage: {
    width: '97%',
    height: 40,
    resizeMode: 'contain',
    marginLeft: 2,
    marginTop: 5,
  },
  foryouBackgroundBottomImage: {
    width: '97.5%',
    height: 40,
    resizeMode: 'contain',
    marginTop: -17,
    marginBottom: 5,
  },
  foryouBackgroundTopImage: {
    width: '97%',
    height: 50,
    resizeMode: 'contain',
    marginLeft: 2,
    marginTop: -20,
    marginBottom: -25,
  },
});

export default HomeScreen;
