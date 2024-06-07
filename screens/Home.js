import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import ArtistsPick from '../components/home_sections/ArtistsPick';

const HomeScreen = () => {
  return (
    <View>
      <NavBar style={styles.navbar} />
      <ScrollView>
        <View style={styles.container}>
        <ArtForYou />
        <FeaturedArtists />
        <ArtistsPick />
        <LoginButton />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 150,
    paddingHorizontal: 10,
  },
  navbar: {

    zIndex: 1000,
  },
});

export default HomeScreen;
