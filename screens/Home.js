import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Navbar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import ArtistsPick from '../components/home_sections/ArtistsPick';
import ArtQuotes from '../components/home_sections/ArtQuotes';
import LongSearchBar from '../components/LongSearchBar';
import FillerMessage from '../components/home_sections/FillerMessage';
import Categories from '../components/home_sections/Categories';
import InviteFriends from '../components/home_sections/InviteFriends';
import FooterNavbar from '../components/FooterNavbar';

const HomeScreen = () => {
  return (
    <ImageBackground 
      source={require('../assets/backgrounds/navbar-bg.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={styles.everything}>
        <View style={styles.navbar}>
          <Navbar />
          {/* <LongSearchBar /> */}
        </View>
        <ScrollView>
          <View style={styles.container}>
            <ArtForYou />
            {/* <ArtQuotes /> */}
            {/* <FillerMessage /> */}
            <InviteFriends />
            <Categories />
            <FeaturedArtists />
            <ArtistsPick />
            {/* this is the original login button and will fix later */}
            {/* <LoginButton /> */}
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
    width: '100%',
    height: 124,
    flex: 1,
  },
  everything: {
    backgroundColor: 'transparent', // Set backgroundColor to transparent
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 300,
    paddingHorizontal: 0,
    alignItems: 'center', // Center horizontally
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
