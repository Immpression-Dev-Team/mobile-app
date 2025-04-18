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

const Profile = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const token = userData?.token;
  const userId = userData?._id;

  const [profileName, setProfileName] = useState('');
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  const [sellingImages, setSellingImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [soldImages, setSoldImages] = useState([]);
  const [boughtImages, setBoughtImages] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return console.warn("no token was found");
      try {
        const profile = await getUserProfile(token);
        setProfileName(profile?.user?.name || '');
        setViewsCount(profile?.user?.views || 0);
    
        // Fetch liked images to get likes count
        const likedImgsRes = await fetchLikedImages(token);
        setLikesCount(likedImgsRes?.images?.length || 0); // Set likesCount based on the number of liked images
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchImageData = async () => {
      if (!token) return console.warn("neither userId nor token were found")
      try {
        const userImgs = await getUserImages(token);

        setSellingImages(
          userImgs?.images?.filter((img) => img.stage === 'approved') || []
        );
        setSoldImages(
          userImgs?.images?.filter((img) => img.stage === 'sold') || []
        );

        const likedImgsRes = await fetchLikedImages(token);
        setLikedImages(likedImgsRes?.images || []);

        setBoughtImages([]); // Add real logic if needed
      } catch (err) {
        console.error('Error loading images:', err);
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
              images={likedImages.map((img) => img.imageLink).filter(Boolean)}
              onPress={() => navigation.navigate('GalleryView', { type: 'liked' })}
            />

            <FolderPreview
              title="Gallery / Selling"
              images={sellingImages.map((img) => img.imageLink).filter(Boolean)}
              onPress={() => navigation.navigate('GalleryView', { type: 'selling' })}
            />

          </View>

          <View style={styles.row}>
            <FolderPreview
              title="Sold"
              images={soldImages.map((img) => img?.imageLink).filter(Boolean)}
              onPress={() => navigation.navigate('GalleryView', { type: 'sold' })}
            />
            <FolderPreview
              title="Bought"
              images={boughtImages.map((img) => img?.imageLink).filter(Boolean)}
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
