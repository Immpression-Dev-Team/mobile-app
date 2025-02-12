import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileGallery from '../components/profile_sections/ProfileGallery';
import ProfileViews from '../components/profile_sections/ProfileViews';
import ProfileLikes from '../components/profile_sections/ProfileLikes'; // Import ProfileLikes
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType';
import { getUserProfile } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';

import ScreenTemplate from './Template/ScreenTemplate';

const Profile = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const token = userData?.token;
  const [profileName, setProfileName] = useState('');
  const profilePicSource = require('../assets/arrow.jpeg'); 
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0); // New state for likes

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token) {
        try {
          const data = await getUserProfile(token);
          if (data?.user) {
            setProfileName(data.user.name || '');
            setViewsCount(data.user.views || 0);
            setLikesCount(data.user.likes || 0); // Fetch likes count
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
        {/* Edit Profile Button */}
        <TouchableOpacity 
          style={styles.editProfileButton} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <View style={styles.nameArtistContainer}>
            <ProfileName name={profileName} />
            <ProfileArtistType />
          </View>

          <TouchableOpacity onPress={() => {}}>
            <ProfilePic source={profilePicSource} />
          </TouchableOpacity>

          {/* Views and Likes Row */}
          <View style={styles.viewsLikesContainer}>
            <ProfileViews views={viewsCount} />
            <ProfileLikes likes={likesCount} />
          </View>

          <View style={styles.bioContainer}>
            <ProfileBio />
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
  editProfileButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editProfileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 55,
    backgroundColor: 'white',
  },
  nameArtistContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  viewsLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bioContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 20,
  },
  galleryContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default Profile;
