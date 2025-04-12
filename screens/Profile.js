import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileViews from '../components/profile_sections/ProfileViews';
import ProfileLikes from '../components/profile_sections/ProfileLikes';
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType';
import { getUserProfile, getUserImages, fetchLikedImages } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from './Template/ScreenTemplate';
import FolderPreview from '../components/FolderPreview';

// Assuming this is the API utility to fetch bought images (add to your API file)
const fetchBoughtImages = async (token) => {
  try {
    const response = await fetch('http://your-api-base-url/api/images/bought', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bought images:', error);
    throw error;
  }
};

const Profile = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const token = userData?.token;
  const userId = userData?.id;

  const [profileName, setProfileName] = useState('');
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  const [sellingImages, setSellingImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [soldImages, setSoldImages] = useState([]);
  const [boughtImages, setBoughtImages] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return;

      try {
        const profile = await getUserProfile(token);
        console.log('Profile Data:', profile); // Debug log
        setProfileName(profile?.user?.name || '');
        setViewsCount(profile?.user?.views || 0);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchImageData = async () => {
      if (!token || !userId) return;

      try {
        // Fetch user images (for Selling and Sold)
        const userImgs = await getUserImages(token);
        console.log('User Images:', userImgs); // Debug log
        const userImages = userImgs?.images || [];
        const approvedImages = userImages
          .filter((img) => img.stage === 'approved')
          .map((img) => img.imageLink)
          .filter(Boolean);
        const soldImages = userImages
          .filter((img) => img.stage === 'sold')
          .map((img) => img.imageLink)
          .filter(Boolean);
        setSellingImages(approvedImages);
        setSoldImages(soldImages);
        console.log('Selling Images:', approvedImages);
        console.log('Sold Images:', soldImages);

        // Fetch liked images (Favorited)
        const likedImgsRes = await fetchLikedImages(token);
        console.log('Liked Images Response:', likedImgsRes); // Debug log
        const likedImageLinks = (likedImgsRes?.images || [])
          .map((img) => img.imageLink)
          .filter(Boolean);
        setLikedImages(likedImageLinks);
        console.log('Liked Images:', likedImageLinks);

        // Fetch bought images (Bought)
        const boughtImgsRes = await fetchBoughtImages(token);
        console.log('Bought Images Response:', boughtImgsRes); // Debug log
        const boughtImageLinks = (boughtImgsRes?.images || [])
          .map((img) => img.imageLink)
          .filter(Boolean);
        setBoughtImages(boughtImageLinks);
        console.log('Bought Images:', boughtImageLinks);
      } catch (err) {
        console.error('Error loading images:', err);
        setSellingImages([]);
        setSoldImages([]);
        setLikedImages([]);
        setBoughtImages([]);
      }
    };

    fetchProfileData();
    fetchImageData();
  }, [token, userId]);

  const profilePicSource = require('../assets/arrow.jpeg');

  return (
    <ScreenTemplate>
      <View style={styles.container}>
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

          <ProfilePic source={profilePicSource} />

          <View style={styles.viewsLikesContainer}>
            <ProfileViews views={viewsCount} />
            <ProfileLikes likes={likesCount} />
          </View>

          <View style={styles.bioContainer}>
            <ProfileBio />
          </View>
        </View>

        <View style={styles.folderGrid}>
          <View style={styles.row}>
            <FolderPreview
              title="Favorited"
              images={likedImages}
              onPress={() => navigation.navigate('GalleryView', { type: 'liked' })}
            />
            <FolderPreview
              title="Gallery / Selling"
              images={sellingImages}
              onPress={() => navigation.navigate('GalleryView', { type: 'selling' })}
            />
          </View>
          <View style={styles.row}>
            <FolderPreview
              title="Sold"
              images={soldImages}
              onPress={() => navigation.navigate('GalleryView', { type: 'sold' })}
            />
            <FolderPreview
              title="Bought"
              images={boughtImages}
              onPress={() => navigation.navigate('GalleryView', { type: 'bought' })}
            />
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  editProfileButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 3,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    zIndex: 10,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
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
  folderGrid: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
});

export default Profile;
