import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import ProfilePic from "../components/profile_sections/ProfilePic";
import ProfileViews from "../components/profile_sections/ProfileViews";
import ProfileLikes from "../components/profile_sections/ProfileLikes";
import {
  getUserProfile,
  getUserImages,
  fetchLikedImages,
  getBio,
  getArtistType,
  // ⬇️ new authenticated helpers you added in API.js
  createStripeAccount,
  checkStripeStatus as checkStripeStatusApi,
} from "../API/API";
import { useAuth } from "../state/AuthProvider";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenTemplate from "./Template/ScreenTemplate";
import FolderPreview from "../components/FolderPreview";
import axios from "axios";
import { API_URL } from "../API_URL";
import * as WebBrowser from "expo-web-browser";

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

        setBoughtImages([]); // hook up real logic if needed
      } catch (err) {
        console.error("Error loading images:", err);
      }
    };

    fetchProfileData();
    fetchImageData();
    fetchBoughtImages();
  }, [token, userId, isOwnProfile]);

  const fetchBoughtImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setBoughtImages(
        (res.data?.data || []).filter((order) => order.userId === currentUserId)
      );
    } catch (e) {
      console.error("Error fetching orders:", e?.response?.data || e?.message || e);
    }
  };

  // ========================= Stripe onboarding actions =========================
  const handleCreateStripeAccount = async () => {
    try {
      const payload = {
        userId: currentUserId,
        userName: profileName,
        userEmail: userData?.user?.user?.email,
      };

      // Authenticated helper (sends Authorization header)
      const res = await createStripeAccount(payload, token);

      // backend returns { success, data: accountLink, user, message }
      const url = res?.data?.url;
      if (url) {
        await WebBrowser.openBrowserAsync(url);
        // You may choose to poll here or let the user tap a button later
        // to re-check their onboarding status.
      }
    } catch (error) {
      console.error("Error creating Stripe account:", error?.response?.data || error);
      Alert.alert("Stripe", "Could not start Stripe onboarding. Please try again.");
    }
  };

  const checkStripeStatus = async () => {
    try {
      const res = await checkStripeStatusApi(token);
      if (res?.data) setStripeOnboardingData(res.data);
    } catch (error) {
      console.error("Error checking Stripe status:", error?.response?.data || error);
    }
  };

  const handleOpenStripeApp = async () => {
    try {
      const stripeAppUrl = "stripe://dashboard";
      const canOpen = await Linking.canOpenURL(stripeAppUrl);

      if (canOpen) {
        await Linking.openURL(stripeAppUrl);
      } else {
        await WebBrowser.openBrowserAsync("https://dashboard.stripe.com");
      }
    } catch (error) {
      console.error("Error opening Stripe:", error);
      Alert.alert(
        "Unable to Open Stripe",
        "Could not open the Stripe app. Please check if you have it installed or try again later.",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    if (token) checkStripeStatus();
  }, [token]);

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {isOwnProfile && (
          <View style={styles.editStripeRow}>
            <TouchableOpacity
              style={styles.editProfileModernButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.editProfileModernText}>Edit Profile</Text>
            </TouchableOpacity>

            {!stripeOnboardingData?.onboarding_completed ? (
              <TouchableOpacity
                style={styles.stripeButton}
                onPress={handleCreateStripeAccount}
              >
                <View style={styles.stripeButtonContent}>
                  <Image
                    source={require("../assets/stripe-logo.png")}
                    style={styles.stripeLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.stripeButtonText}>Link Stripe Account</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.stripeLinkedButton}
                onPress={handleOpenStripeApp}
              >
                <View style={styles.stripeButtonContent}>
                  <Image
                    source={require("../assets/stripe-logo.png")}
                    style={styles.stripeLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.stripeLinkedText}>View Stripe Account</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.profileContainer}>
          <View style={styles.nameArtistContainer}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.artistType}>{artistType}</Text>
          </View>

          <View style={styles.profilePicWrapper}>
            <ProfilePic
              source={
                !isOwnProfile && profilePicture ? { uri: profilePicture } : null
              }
              name={profileName}
            />
          </View>

          <View style={styles.viewsLikesContainer}>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>👁</Text>
              <ProfileViews views={viewsCount} />
            </View>
            {isOwnProfile && (
              <View style={styles.statPill}>
                <Text style={styles.statIcon}>❤️</Text>
                <ProfileLikes likes={likesCount} />
              </View>
            )}
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{bio}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {isOwnProfile && (
          <View style={styles.folderGrid}>
            <View style={styles.folderRow}>
              <FolderPreview
                title="Favorited"
                images={[likedImages.find((img) => img.imageLink)?.imageLink]}
                onPress={() =>
                  navigation.navigate("GalleryView", { type: "liked" })
                }
              />
              <FolderPreview
                title="Gallery / Selling"
                images={[sellingImages.find((img) => img.imageLink)?.imageLink]}
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
    backgroundColor: "#FFF",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#FFF",
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.36,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  nameArtistContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  artistType: {
    backgroundColor: "#EAEAFF",
    color: "#635BFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  profilePicWrapper: {
    borderRadius: 100,
    padding: 4,
    borderColor: "#635BFF",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  viewsLikesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 10,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statIcon: {
    marginRight: 6,
  },
  bioContainer: {
    width: "90%",
    marginTop: 16,
    alignItems: "center",
  },
  bioText: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    textAlign: "center",
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  folderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  editStripeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 20,
    gap: 10,
  },
  editProfileModernButton: {
    borderColor: "#999",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    maxWidth: 150,
  },
  editProfileModernText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  stripeButton: {
    backgroundColor: "#635BFF",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 180,
  },
  stripeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stripeLogo: {
    width: 20,
    height: 20,
  },
  stripeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  stripeLinkedButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 180,
  },
  stripeLinkedIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  stripeLinkedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default Profile;
