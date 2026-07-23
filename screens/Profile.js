// screens/Profile.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";

const SCREEN_W = Dimensions.get("window").width;
const THUMB = (SCREEN_W - 4) / 3; // 3-column grid with 2px total gap
import ProfilePic from "../components/profile_sections/ProfilePic";
import ProfileViews from "../components/profile_sections/ProfileViews";
import ProfileLikes from "../components/profile_sections/ProfileLikes";
import {
  getUserProfile,
  getUserImages,
  fetchLikedImages,
  getBio,
  getArtistType,
  createStripeAccount,
  checkStripeStatus as checkStripeStatusApi,
  blockUser,
  checkBlockStatus,
  incrementViews,
  getSellerBalance,
  getPublicUserImages,
} from "../API/API";
import { useAuth } from "../state/AuthProvider";
import ReportModal from "../components/ReportModal";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import ScreenTemplate from "./Template/ScreenTemplate";
import FolderPreview from "../components/FolderPreview";
import axios from "axios";
import { API_URL } from "../API_URL";
import * as WebBrowser from "expo-web-browser";

const formatCurrency = (amount) => {
  const n = Number(amount);
  if (isNaN(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
};

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
  const [showReportModal, setShowReportModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  // Public gallery state (other users' profiles)
  const [publicImages, setPublicImages] = useState([]);
  const [publicImagesLoading, setPublicImagesLoading] = useState(false);

  // Seller balance state
  const [balanceAvailable, setBalanceAvailable] = useState(null);
  const [balancePending, setBalancePending] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (isOwnProfile) {
          const profile = await getUserProfile(token);
          const u = profile?.user || {};
          setProfileName(u?.name || "");
          setViewsCount(u?.views || 0);
          if (u?.profilePictureLink) {
            setProfilePicture(u.profilePictureLink);
          }

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

        const allImages = userImgs?.images || [];

        setSellingImages(allImages.filter((img) => img.stage === "approved"));
        setSoldImages(allImages.filter((img) => img.stage === "sold"));

        const totalLikes = allImages.reduce(
          (sum, img) => sum + (img.likes?.length || 0),
          0
        );
        setLikesCount(totalLikes);

        const likedImgsRes = await fetchLikedImages(token);
        setLikedImages(likedImgsRes?.images || []);

        setBoughtImages([]);
      } catch (err) {
        console.error("Error loading images:", err);
      }
    };

    const fetchPublicImages = async () => {
      if (isOwnProfile || !userId) return;
      setPublicImagesLoading(true);
      try {
        const res = await getPublicUserImages(userId);
        setPublicImages(res?.images || []);
      } catch {
        setPublicImages([]);
      } finally {
        setPublicImagesLoading(false);
      }
    };

    fetchProfileData();
    fetchImageData();
    fetchBoughtImages();
    fetchPublicImages();

    if (!isOwnProfile && token && userId) {
      checkBlockStatus(userId, token).then((result) => {
        if (result.success) {
          setIsBlocked(result.data.isBlocked);
        }
      });
    }
  }, [token, userId, isOwnProfile]);

  // Re-fetch view count and increment profile views whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const refreshViews = async () => {
        try {
          if (isOwnProfile) {
            const profile = await getUserProfile(token);
            const u = profile?.user || {};
            setViewsCount(u?.views || 0);
          } else {
            if (token && userId) {
              await incrementViews(userId, token);
            }
            const res = await axios.get(`${API_URL}/profile/${userId}`);
            setViewsCount(res.data?.user?.views || 0);
          }
        } catch (err) {
          // silently ignore
        }
      };
      refreshViews();
    }, [token, userId, isOwnProfile])
  );

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
      const res = await createStripeAccount(payload, token);
      const url = res?.data?.url;
      if (url) {
        await WebBrowser.openBrowserAsync(url);
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

  // ========================= Seller balance =========================
  const fetchBalance = useCallback(async () => {
    if (!isOwnProfile || !token) return;
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const res = await getSellerBalance(token);
      setBalanceAvailable(res?.available ?? 0);
      setBalancePending(res?.pending ?? 0);
    } catch (err) {
      setBalanceError("Could not load balance.");
      setBalanceAvailable(0);
      setBalancePending(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [isOwnProfile, token]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Handle blocking/unblocking a user
  const handleBlockUser = async () => {
    if (!token || !userId || isOwnProfile) return;

    Alert.alert(
      `${isBlocked ? "Unblock" : "Block"} ${profileName || "this user"}?`,
      isBlocked
        ? "They will be able to appear in your feed again."
        : "They won't be able to see your content in their feed, and their content will be hidden from yours.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isBlocked ? "Unblock" : "Block",
          style: isBlocked ? "default" : "destructive",
          onPress: async () => {
            setIsBlocking(true);
            try {
              if (isBlocked) {
                const { unblockUser } = require("../API/API");
                const result = await unblockUser(userId, token);
                if (result.success) {
                  setIsBlocked(false);
                } else {
                  Alert.alert("Error", result.error || "Failed to unblock user");
                }
              } else {
                const result = await blockUser(userId, null, token);
                if (result.success) {
                  setIsBlocked(true);
                  Alert.alert("Blocked", `${profileName || "User"} has been blocked.`);
                } else {
                  Alert.alert("Error", result.error || "Failed to block user");
                }
              }
            } catch (error) {
              Alert.alert("Error", "An error occurred. Please try again.");
            } finally {
              setIsBlocking(false);
            }
          },
        },
      ]
    );
  };

  const isStripeConnected = !!stripeOnboardingData?.onboarding_completed;

  return (
    <ScreenTemplate>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {isOwnProfile && (
          <View style={styles.editStripeRow}>
            <TouchableOpacity
              style={styles.editProfileModernButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.editProfileModernText}>Edit Profile</Text>
            </TouchableOpacity>

            {!isStripeConnected ? (
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

          <View
            style={styles.profilePicWrapper}
            pointerEvents={isOwnProfile ? "auto" : "none"}
          >
            <ProfilePic
              source={profilePicture ? { uri: profilePicture } : null}
              name={profileName}
              editable={isOwnProfile}
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

          {!isOwnProfile && token && (
            <View style={styles.profileActionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, isBlocked && styles.unblockButton]}
                onPress={handleBlockUser}
                disabled={isBlocking}
              >
                <Text style={[styles.actionButtonText, isBlocked && styles.unblockButtonText]}>
                  {isBlocking ? "..." : isBlocked ? "Unblock" : "Block"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => setShowReportModal(true)}
              >
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.separator} />

        {/* Seller Balance — own profile only */}
        {isOwnProfile && (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Your Balance</Text>

            {balanceLoading ? (
              <ActivityIndicator size="small" color="#635BFF" style={styles.balanceLoader} />
            ) : balanceError ? (
              <Text style={styles.balanceErrorText}>{balanceError}</Text>
            ) : (
              <>
                <View style={styles.balanceRow}>
                  <View style={styles.balanceStat}>
                    <Text style={styles.balanceLabel}>Available</Text>
                    <Text style={styles.balanceAmount}>{formatCurrency(balanceAvailable)}</Text>
                  </View>
                  {balancePending !== null && balancePending > 0 && (
                    <View style={styles.balanceStat}>
                      <Text style={styles.balanceLabel}>Pending</Text>
                      <Text style={[styles.balanceAmount, styles.balanceAmountPending]}>
                        {formatCurrency(balancePending)}
                      </Text>
                    </View>
                  )}
                </View>

                {!isStripeConnected ? (
                  <>
                    <Text style={styles.balanceNote}>
                      Connect Stripe to withdraw your earnings.
                    </Text>
                    <TouchableOpacity
                      style={styles.balanceConnectButton}
                      onPress={handleCreateStripeAccount}
                    >
                      <Text style={styles.balanceConnectText}>Connect Stripe</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.balanceLinkedNote}>
                    Your Stripe account is connected. Visit your Stripe dashboard to manage payouts.
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        {isOwnProfile && (
          <View style={styles.folderGrid}>
            <View style={styles.folderRow}>
              <FolderPreview
                title="Favorited"
                images={likedImages.map((img) => img.imageLink).filter(Boolean)}
                onPress={() =>
                  navigation.navigate("GalleryView", { type: "liked" })
                }
              />
              <FolderPreview
                title="Gallery / Selling"
                images={sellingImages.map((img) => img.imageLink).filter(Boolean)}
                onPress={() =>
                  navigation.navigate("GalleryView", { type: "selling" })
                }
              />
            </View>
          </View>
        )}

        {/* ── Public gallery (other users' profiles only) ─────────── */}
        {!isOwnProfile && (
          <View style={styles.publicGallerySection}>
            <View style={styles.publicGalleryHeader}>
              <Text style={styles.publicGalleryTitle}>
                {publicImagesLoading
                  ? "Gallery"
                  : publicImages.length > 0
                  ? `Gallery  ·  ${publicImages.length}`
                  : "Gallery"}
              </Text>
            </View>

            {publicImagesLoading ? (
              <ActivityIndicator
                size="small"
                color="#635BFF"
                style={{ marginVertical: 24 }}
              />
            ) : publicImages.length === 0 ? (
              <Text style={styles.publicGalleryEmpty}>
                No artwork listed for sale yet.
              </Text>
            ) : (
              <View style={styles.publicGalleryGrid}>
                {publicImages.map((img, index) => (
                  <TouchableOpacity
                    key={img._id}
                    style={styles.publicGalleryItem}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("ImageScreen", {
                        images: publicImages,
                        initialIndex: index,
                      })
                    }
                  >
                    <Image
                      source={{ uri: img.imageLink }}
                      style={styles.publicGalleryThumb}
                      resizeMode="cover"
                    />
                    {img.isSold && (
                      <View style={styles.soldBadge}>
                        <Text style={styles.soldBadgeText}>SOLD</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          targetType="user"
          targetId={userId}
          targetName={profileName}
        />
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    paddingBottom: 30,
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
  // ── Seller Balance Card ──────────────────────────────
  balanceCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  balanceTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  balanceLoader: {
    marginVertical: 4,
    alignSelf: "flex-start",
  },
  balanceErrorText: {
    fontSize: 12,
    color: "#DC2626",
  },
  balanceRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 6,
  },
  balanceStat: {
    alignItems: "flex-start",
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  balanceAmount: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
  },
  balanceAmountPending: {
    color: "#D97706",
  },
  balanceNote: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 8,
    lineHeight: 16,
  },
  balanceConnectButton: {
    borderWidth: 1,
    borderColor: "#635BFF",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  balanceConnectText: {
    color: "#635BFF",
    fontSize: 12,
    fontWeight: "600",
  },
  balanceLinkedNote: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  // ────────────────────────────────────────────────────
  folderGrid: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
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
  stripeLinkedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  profileActionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  unblockButton: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },
  unblockButtonText: {
    color: "#4F46E5",
  },
  reportButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  reportButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },

  // ── Public gallery ──────────────────────────────────────
  publicGallerySection: {
    marginTop: 8,
  },
  publicGalleryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  publicGalleryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  publicGalleryEmpty: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  publicGalleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  publicGalleryItem: {
    width: THUMB,
    height: THUMB,
    margin: 0.5,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  publicGalleryThumb: {
    width: "100%",
    height: "100%",
  },
  soldBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.52)",
    paddingVertical: 3,
    alignItems: "center",
  },
  soldBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  // ────────────────────────────────────────────────────────
});

export default Profile;
