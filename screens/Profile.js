import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfileViews from '../components/profile_sections/ProfileViews';
import ProfileLikes from '../components/profile_sections/ProfileLikes';
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType';
import {
  getUserProfile,
  getUserImages,
  getAllImages,
  fetchLikedImages,
} from '../API/API';
import { useAuth } from '../state/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import ScreenTemplate from './Template/ScreenTemplate';
import FolderPreview from '../components/FolderPreview';

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
        setProfileName(profile?.user?.name || '');
        setViewsCount(profile?.user?.views || 0);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchImageData = async () => {
      if (!token || !userId) return;
    
      try {
        const userImgs = await getUserImages(token);
    
        setSellingImages(userImgs?.images?.filter((img) => img.stage === 'approved') || []);
        setSoldImages(userImgs?.images?.filter((img) => img.stage === 'sold') || []);
    
        const likedImgsRes = await fetchLikedImages(token);
        setLikedImages(likedImgsRes?.images || []);
        
    
        setBoughtImages([]); // placeholder
      } catch (err) {
        console.error('Error loading images:', err);
      }
    };

    fetchProfileData();
    fetchImageData();
  }, [token]);

  const profilePicSource = require('../assets/arrow.jpeg');

  return (
    <ScreenTemplate>
      <ScrollView contentContainerStyle={styles.container}>
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

        {/* Folder UI */}
        <View style={styles.folderGrid}>
          <FolderPreview
            title="Favorited"
            count={likedImages.length}
            images={likedImages.map((img) => img.imageLink)}
            onPress={() => navigation.navigate('GalleryView', { type: 'liked' })}
          />
          <FolderPreview
            title="Gallery / Selling"
            count={sellingImages.length}
            images={sellingImages.map((img) => img.imageLink)}
            onPress={() => navigation.navigate('GalleryView', { type: 'selling' })}
          />
          <FolderPreview
            title="Sold"
            count={soldImages.length}
            images={soldImages.map((img) => img.imageLink)}
            onPress={() => navigation.navigate('GalleryView', { type: 'sold' })}
          />
          <FolderPreview
            title="Bought"
            count={boughtImages.length}
            images={boughtImages.map((img) => img.imageLink)}
            onPress={() => navigation.navigate('GalleryView', { type: 'bought' })}
          />
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  editProfileButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 10,
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
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default Profile;
