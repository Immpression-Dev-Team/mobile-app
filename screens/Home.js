import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../components/Navbar';
import LoginButton from '../components/LoginButton';
import ArtForYou from '../components/home_sections/ArtForYou';
import FeaturedArtists from '../components/home_sections/FeaturedArtists';
import ArtistsPick from '../components/home_sections/ArtistsPick';
import ArtQuotes from '../components/home_sections/ArtQuotes';
import LongSearchBar from '../components/LongSearchBar';
import FillerMessage from '../components/home_sections/FillerMessage';
import Categories from '../components/home_sections/Categories';


// TODO conditionally render if the user is logged in or not (remove the login button when logged in and show the the logout button instead)
const HomeScreen = () => {
  return (
    <View style={styles.everything}>
      <View style={styles.navbar}>
        <NavBar />
        <LongSearchBar /><LoginButton />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <ArtForYou />
          {/* <ArtQuotes /> */}
          {/* <FillerMessage /> */}
          <Categories />
          <FeaturedArtists />
          <ArtistsPick />
          // this is the original login button and will fix later
          {/* <LoginButton /> */}
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
    // backgroundColor: '#acb3bf',
    flex: 1,
    paddingBottom: 150,
    paddingHorizontal: 0,
  },
  navbar: {
    // borderBottomWidth: 1,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10, 
    // borderColor: '#ccc',
    // paddingBottom: 2,

    zIndex: 1000,
  },
});

export default HomeScreen;
