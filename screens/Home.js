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
  const name = useAuth()
  console.log(name.userData.user.user.name);

  return (
    // <ImageBackground
    //   source={require("../assets/backgrounds/navbar-bg2.png")} // Replace with your image path
    //   style={styles.backgroundImage}
    // >
      <View style={styles.everything}>
        <View style={styles.navbar}>
          <Navbar />
        </View>
        {/* <ScrollView> */}
        <View style={styles.container}>
          <Image source={foryouBackgroundTop} style={styles.foryouBackgroundTopImage} />
          <ArtForYou />
          <Image source={foryouBackgroundBottom} style={styles.foryouBackgroundBottomImage} />

          <MiddleButtons />

          <Image source={discoverBackgroundTop} style={styles.discoverBackgroundTopImage} />
          <FeaturedArtists />
          <Image source={discoverBackgroundBottom} style={styles.discoverBackgroundBottomImage} />

          {/* Other components can be added below as needed */}
          {/* <Categories />
            <InviteFriends />
            <ArtOfTheDay />
            <ArtistsPick /> */}
        </View>
        {/* </ScrollView> */}
        <View style={styles.footer}>
          <FooterNavbar />
        </View>
      </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 124,
    flex: 1,
  },
  everything: {
    backgroundColor: "white", // Set backgroundColor to transparent
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 0,
    alignItems: "center", // Center horizontally
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
    width: '97.5%',  // Ensure the image covers the width of the screen
    height: 50,  // Adjust height as needed
    resizeMode: 'contain',  // Resize to contain within the area
    marginTop: -400,  // Add some margin at the top if needed
  },
  discoverBackgroundTopImage: {
    width: '97%',  // Ensure the image covers the width of the screen
    height: 40,  // Adjust height as needed
    resizeMode: 'contain',  // Resize to contain within the area
    marginLeft: 2,
    marginTop: 5,
    // marginTop: -382,  // Add some margin at the top if needed
  },
  foryouBackgroundBottomImage: {
    width: '97.5%',  // Ensure the image covers the width of the screen
    height: 40,  // Adjust height as needed
    resizeMode: 'contain',  // Resize to contain within the area
    marginTop: -17,  // Add some margin at the top if needed
    marginBottom: 5,
  },
  foryouBackgroundTopImage: {
    width: '97%',  // Ensure the image covers the width of the screen
    height: 50,  // Adjust height as needed
    resizeMode: 'contain',  // Resize to contain within the area
    marginLeft: 2,
    marginTop: -20,
    marginBottom: -25,
    // marginTop: -382,  // Add some margin at the top if needed
  },
});

export default HomeScreen;
