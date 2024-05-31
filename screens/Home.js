import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import UpcomingArtists from '../components/home_sections/TrendingArt';

const HomeScreen = () => {
  return (
    <View>
      <NavBar style={styles.navbar} />
      <ScrollView>
        <View style={styles.container}>
        <ArtForYou />
        <FeaturedArtists />
        <UpcomingArtists />
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
