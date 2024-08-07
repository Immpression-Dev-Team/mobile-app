import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

// TODO conditionally render if the user is logged in or not (remove the login button when logged in and show the logout button instead)
const HomeScreen = () => {
  return (
    <View style={styles.everything}>
      <View style={styles.navbar}>
        <Navbar />
        <LongSearchBar />
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
  );
};

const styles = StyleSheet.create({
  everything: {
    backgroundColor: 'white',
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
  },
  footer: {
    zIndex: 1000,
  },
});

export default HomeScreen;
