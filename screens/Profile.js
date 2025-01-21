import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileViews from '../components/profile_sections/ProfileViews';
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType';
import { getUserProfile } from '../API/API';
import { useAuth } from '../state/AuthProvider';

import ScreenTemplate from './Template/ScreenTemplate';

const Profile = () => {
  const { userData } = useAuth(); // Use the useAuth hook to get the user data
  const token = userData?.token; // Extract the token from userData
  const [profileName, setProfileName] = useState(''); // Initialize as an empty string
  const profilePicSource = require('../assets/arrow.jpeg'); // Example profile picture
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token) {
        try {
          const data = await getUserProfile(token);
          if (data?.user) {
            setProfileName(data.user.name || ''); // Set profile name if available
            setViewsCount(data.user.views || 0); // Set views count if available
          } else {
            console.error('Error: user data is undefined in fetchProfileData');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, [token]);

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => {}}>
            <ProfilePic source={profilePicSource} />
          </TouchableOpacity>
          <ProfileName name={profileName} />
          <ProfileViews views={viewsCount} />
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
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
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
    width: '90%', // Reduce width to center better
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    marginVertical: 20, // Adjust margin for spacing
    padding: 10,
    borderRadius: 10,
  },
  bioContainer: {
    width: '100%', // Take full width
    marginBottom: 10, // Add space between bio and artist type
    alignItems: 'center', // Ensure contents of bio are centered
  },
  artistTypeContainer: {
    width: '100%', // Take full width
    alignItems: 'center', // Ensure contents of artist type are centered
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
});

export default Profile;