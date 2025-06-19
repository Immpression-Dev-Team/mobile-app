import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fetchLikedImages, getUserImages, getUserProfile } from '../API/API';
import { API_URL } from '../API_URL';
import FolderPreview from '../components/FolderPreview';
import ProfileArtistType from '../components/profile_sections/ProfileArtistType';
import ProfileBio from '../components/profile_sections/ProfileBio';
import ProfileLikes from '../components/profile_sections/ProfileLikes';
import ProfileName from '../components/profile_sections/ProfileName';
import ProfilePic from '../components/profile_sections/ProfilePic';
import ProfileViews from '../components/profile_sections/ProfileViews';
import { useAuth } from '../state/AuthProvider';
import ScreenTemplate from './Template/ScreenTemplate';

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useAuth();
  const token = userData?.token;
  const currentUserId = userData?._id;
  const isOwnProfile =
    !route.params?.userId || route.params?.userId === currentUserId;
  const userId = route.params?.userId || currentUserId;

  const [profileName, setProfileName] = useState('');
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [bio, setBio] = useState('');
  const [artistType, setArtistType] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const [sellingImages, setSellingImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [soldImages, setSoldImages] = useState([]);
  const [boughtImages, setBoughtImages] = useState([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (isOwnProfile) {
          const profile = await getUserProfile(token);
          console.log(profile);
          console.log(profile.artistType);
          setProfileName(profile?.user?.name || '');
          setBio(profile?.user?.bio || '');
          setViewsCount(profile?.user?.views || 0);
          setArtistType(profile?.user?.artistType);
          setLikesCount(profile?.user?.totalLikes || 0);
        } else {
          const res = await axios.get(`${API_URL}/profile/${userId}`);

          const user = res.data.user;
          const totalLikes = res.data.totalLikes;
          setProfileName(user?.name || '');
          setViewsCount(user?.views || 0);
          setBio(user?.bio || '');
          setArtistType(user?.artistType || '');
          setProfilePicture(user?.profilePictureLink || null);
          setLikesCount(totalLikes || 0);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchImageData = async () => {
      if (!isOwnProfile || !token) return;
      try {
        const userImgs = await getUserImages(token);

        console.log(
          'USERIMAGES====USERIMAGES:',
          JSON.stringify(userImgs, null, 2)
        );

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

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <View style={styles.profileContainer}>
          <View style={styles.nameArtistContainer}>
            <ProfileName name={profileName} />
            <ProfileArtistType artistType={artistType} />
          </View>

          <ProfilePic
            source={
              !isOwnProfile && profilePicture ? { uri: profilePicture } : null
            }
            name={profileName}
          />

          <View style={styles.viewsLikesContainer}>
            <ProfileViews views={viewsCount} />
            {true && <ProfileLikes likes={likesCount} />}
          </View>

          <View style={styles.bioContainer}>
            <ProfileBio bio={bio} />
          </View>
        </View>

        <View style={styles.separator} />

        {isOwnProfile && (
          <View style={styles.folderGrid}>
            <View style={styles.row}>
              <FolderPreview
                title="Favorited"
                images={likedImages.map((img) => img.imageLink).filter(Boolean)}
                onPress={() =>
                  navigation.navigate('GalleryView', { type: 'liked' })
                }
              />

              <FolderPreview
                title="Gallery / Selling"
                images={
                  sellingImages
                  // .map((img) => img.imageLink)
                  // .filter(Boolean)
                }
                onPress={() =>
                  navigation.navigate('GalleryView', { type: 'selling' })
                }
              />
            </View>
          </View>
        )}
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
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 10,
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
