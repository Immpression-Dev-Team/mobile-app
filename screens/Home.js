import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import UpcomingArtists from '../components/home_sections/UpcomingArtists';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar style={styles.navbar} />
      <ScrollView>
        <ArtForYou />
        <FeaturedArtists />
        <UpcomingArtists />
        <LoginButton />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default HomeScreen;
