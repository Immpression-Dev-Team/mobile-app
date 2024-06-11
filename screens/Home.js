import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import ArtistsPick from '../components/home_sections/ArtistsPick';
import ArtQuotes from '../components/home_sections/ArtQuotes';
import LongSearchBar from '../components/LongSearchBar';

const HomeScreen = () => {
  return (
    <View style={styles.everything}>
      <NavBar style={styles.navbar} />
      <LongSearchBar />
      <ScrollView>
        <View style={styles.container}>
        <ArtForYou />
        <ArtQuotes />
        <FeaturedArtists />
        <ArtistsPick />
        <LoginButton />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  everything: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingBottom: 150,
    paddingHorizontal: 0,
  },
  navbar: {

    zIndex: 1000,
  },
});

export default HomeScreen;
