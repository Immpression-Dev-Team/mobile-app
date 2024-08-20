import React from "react";
import { View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import Navbar from "../components/Navbar";
import ArtOfTheDay from "../components/home_sections/ArtOfTheDay";
import InviteFriends from "../components/home_sections/InviteFriends";
import Categories from "../components/home_sections/Categories";
import FeaturedArtists from "../components/home_sections/FeaturedArtists";
import ArtistsPick from "../components/home_sections/ArtistsPick";
import FooterNavbar from "../components/FooterNavbar";
import ArtForYou from "../components/home_sections/ArtForYou";

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/backgrounds/navbar-bg2.png")} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.everything}>
        <View style={styles.navbar}>
          <Navbar />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <ArtForYou />
            <FeaturedArtists />
            <Categories />
            <InviteFriends />
            <ArtOfTheDay />
            

            <ArtistsPick />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <FooterNavbar />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 124,
    flex: 1,
  },
  everything: {
    backgroundColor: "transparent", // Set backgroundColor to transparent
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 300,
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
});

export default HomeScreen;
