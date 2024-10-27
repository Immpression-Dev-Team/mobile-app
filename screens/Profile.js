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
import { marginBottom } from '../styles/helper';

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
        
        {/* New container for Bio and ArtistType centered */}
        <View style={styles.bioArtistContainer}>
          <View style={styles.bioContainer}>
            <ProfileBio />
          </View>
          <View style={styles.artistTypeContainer}>
            <ProfileArtistType />
          </View>
        </View>
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
  everything: {
    flex: 1,  // Ensure the main container takes up the full height
    paddingTop: 60,
  },
  navbarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  navbarBackgroundImage: {
    width: "100%",
    resizeMode: 'cover',
    opacity: 0.9,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 55,
    position: 'relative',
    backgroundColor: 'white',
  },
  profilePic: {
    borderRadius: 50,
    borderColor: '#e0e0e0',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 8,
  },
  profileViews: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  bioArtistContainer: {
    width: '90%',  // Reduce width to center better
    flexDirection: 'column',  // Stack items vertically
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',  // Center horizontally
    marginVertical: 20,  // Adjust margin for spacing
    padding: 10,
    borderRadius: 10,
  },
  bioContainer: {
    width: '100%',  // Take full width
    marginBottom: marginBottom(), // Add space between bio and artist type
    alignItems: 'center',  // Ensure contents of bio are centered
  },
  artistTypeContainer: {
    width: '100%',  // Take full width
    alignItems: 'center',  // Ensure contents of artist type are centered
  },
  galleryContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  galleryItem: {
    width: '45%',
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopColor: '#dfe6e9',
    borderTopWidth: 1,
    position: 'absolute',  // Stick the footer to the bottom
    bottom: 0,
    width: '100%',
  },
});


export default Profile;
