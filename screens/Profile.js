import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Navbar from '../components/Navbar';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileViews from '../components/profile_sections/ProfileViews';
import FooterNavbar from '../components/FooterNavbar';
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType'; 
import { getUserProfile } from '../API/API';
import { useAuth } from '../state/AuthProvider';  // Import the useAuth hook

const Profile = () => {
  const { userData } = useAuth();  // Use the useAuth hook to get the user data
  const token = userData?.token;   // Extract the token from userData
  const [profileName, setProfileName] = useState('');  // Initialize as an empty string
  const profilePicSource = require('../assets/artists/flight.png'); // Example profile picture
  const viewsCount = 394;  // Example views count

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token) {  // Ensure we have a token before fetching data
        try {
          const data = await getUserProfile(token);  // Fetch the user profile data with the token
          console.log('Profile Data:', data);  // Check if name is being fetched correctly
          setProfileName(data.user.name);  // Update the profile name with data from the server
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
  
    fetchProfileData();
  }, [token]);  

  return (
    <View style={styles.everything}>
      <View style={styles.navbarContainer}>
        <ImageBackground
          source={require("../assets/backgrounds/navbar-bg3.png")}
          style={styles.navbarBackgroundImage}
        >
          <Navbar />
        </ImageBackground>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <ProfilePic source={profilePicSource} />
          <ProfileName name={profileName} /> 
          <ProfileViews views={viewsCount} />
          <ProfileBio />
          <ProfileArtistType />
        </View>
        <View style={styles.galleryContainer}>
          <ProfileGallery />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FooterNavbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },
  navbarBackgroundImage: {
    width: "100%",
    height: 80,
    resizeMode: 'cover',
  },
  everything: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 115,
  },
  container: {
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  galleryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -150,
  },
  footer: {
    zIndex: 1000,
  },
});

export default Profile;
