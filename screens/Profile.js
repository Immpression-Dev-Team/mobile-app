import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import ProfilePic from "../components/profile_sections/ProfilePic";
import ProfileName from "../components/profile_sections/ProfileName";
import ProfileViews from "../components/profile_sections/ProfileViews";
import ProfileLikes from "../components/profile_sections/ProfileLikes";
import ProfileBio from "../components/profile_sections/ProfileBio";
import ProfileArtistType from "../components/profile_sections/ProfileArtistType";
import {
  getUserProfile,
  getUserImages,
  fetchLikedImages,
  getBio,
  getArtistType,
} from "../API/API";
import { useAuth } from "../state/AuthProvider";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenTemplate from "./Template/ScreenTemplate";
import FolderPreview from "../components/FolderPreview";
import axios from "axios";
import { API_URL } from "../API_URL";

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useAuth();
  const token = userData?.token;
  const currentUserId = userData?.user?.user?._id;
  const isOwnProfile =
    !route.params?.userId || route.params?.userId === currentUserId;
  const userId = route.params?.userId || currentUserId;

  const [profileName, setProfileName] = useState("");
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [bio, setBio] = useState("");
  const [artistType, setArtistType] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const [sellingImages, setSellingImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [soldImages, setSoldImages] = useState([]);
  const [boughtImages, setBoughtImages] = useState([]);
  const [stripeOnboardingData, setStripeOnboardingData] = useState({});
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (isOwnProfile) {
          const profile = await getUserProfile(token);
          setProfileName(profile?.user?.name || "");
          setViewsCount(profile?.user?.views || 0);

          const [bioRes, artistRes] = await Promise.all([
            getBio(token),
            getArtistType(token),
          ]);
          if (bioRes?.bio) setBio(bioRes.bio);
          if (artistRes?.artistType) setArtistType(artistRes.artistType);
        } else {
          const res = await axios.get(`${API_URL}/profile/${userId}`);
          const user = res.data.user;
          setProfileName(user?.name || "");
          setViewsCount(user?.views || 0);
          setBio(user?.bio || "");
          setArtistType(user?.artistType || "");
          setProfilePicture(user?.profilePictureLink || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchImageData = async () => {
      if (!isOwnProfile || !token) return;
      try {
        const userImgs = await getUserImages(token);

        setSellingImages(
          userImgs?.images?.filter((img) => img.stage === "approved") || []
        );
        setSoldImages(
          userImgs?.images?.filter((img) => img.stage === "sold") || []
        );

        const likedImgsRes = await fetchLikedImages(token);
        setLikedImages(likedImgsRes?.images || []);

        setBoughtImages([]); // Add real logic if needed
      } catch (err) {
        console.error("Error loading images:", err);
      }
    };

    fetchProfileData();
    fetchImageData();
    fetchBoughtImages();
  }, [token, userId]);

  const fetchBoughtImages = async () => {
    const res = await axios.get(`${API_URL}/orders`);
    setBoughtImages(
      res.data.data.filter((order) => order.userId === currentUserId)
    );
  };

  const handlePayout = async () => {
    console.log("payout");

    const res = await axios.post(`${API_URL}/payout`, {
      stripeConnectId: "acct_1RdcTdQPrkTTRhKX",
      amount: 2,
    });
    console.log("res", res.data);
  };

  const handleCreateStripeAccount = async () => {
    // console.log("create stripe account");
    try {
      const res = await axios.post(`${API_URL}/create-stripe-account`, {
        userId: currentUserId,
        userName: profileName,
        userEmail: userData.user.user.email,
        credentials: "include", // this ensures cookies are sent
      });
      if (res.data.data.url) {
        Linking.openURL(res.data.data.url);
      }
      // await createStripeOnboarding(res.data.data.id);
    } catch (error) {
      // console.error("Error creating stripe account:", error);
    }
  };

  const checkStripeStatus = async () => {
    try {
      const res = await axios.post(`${API_URL}/check-stripe-status`, {}, {
        withCredentials: true  // ✅ Correct syntax for axios (not "credentials: include")
      });

      // Update onboarding completion status
      if (res.data?.data) {
        setStripeOnboardingData(res.data?.data)
      }

    } catch (error) {
      console.error("Error checking status:", error);
      console.error("Error details:", error.response?.data); // Added more detailed error logging
    }
  };

  useEffect(() => {
    checkStripeStatus();
  }, []);

  // const createStripeOnboarding = async (stripeConnectId) => {
  //   console.log("create stripe onboarding");

  //   const res = await axios.post(`${API_URL}/createStripeOnboardingLink`, {
  //     stripeConnectId: stripeConnectId,
  //   });
  //   if (res.data.data.url) {
  //     Linking.openURL(res.data.data.url);
  //   }
  //   console.log("res", res.data.data.url);
  // };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        {isOwnProfile && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.viewProfileButton}
              onPress={handlePayout}
            >
              <Text style={styles.viewProfileButtonText}>Payout</Text>
            </TouchableOpacity>

            {!stripeOnboardingData?.onboarding_completed && !stripeOnboardingData?.stripeAccountId && (
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={handleCreateStripeAccount}
              >
                <Text style={styles.viewProfileButtonText}>Create Stripe Account</Text>
              </TouchableOpacity>
            )}
          </View>
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
            {isOwnProfile && <ProfileLikes likes={likesCount} />}
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
                  navigation.navigate("GalleryView", { type: "liked" })
                }
              />

              <FolderPreview
                title="Gallery / Selling"
                images={sellingImages
                  .map((img) => img.imageLink)
                  .filter(Boolean)}
                onPress={() =>
                  navigation.navigate("GalleryView", { type: "selling" })
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
    position: "absolute",
    top: 10,
    left: 20,
    backgroundColor: "#FF6B6B",
    paddingVertical: 3,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    zIndex: 10,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
    marginHorizontal: 20,
    gap: 10,
  },
  viewProfileButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 150,
  },
  viewProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "white",
  },
  nameArtistContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  viewsLikesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  bioContainer: {
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 10,
  },
  folderGrid: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
});

export default Profile;
