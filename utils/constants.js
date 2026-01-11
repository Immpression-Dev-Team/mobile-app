import SettingsScreen from "../screens/Settings";
import HomeScreen from "../screens/Home";
import StatisticsScreen from "../screens/Statistics";
import Profile from "../screens/Profile";
import SignUp from "../screens/SignUp";
import ImageScreen from "../components/ImageScreen";
import PasswordReset from "../screens/PasswordReset";
import ArtistScreen from "../components/ArtistScreens";
import Upload from "../screens/Upload";
import Login from "../screens/Login";
import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryView from "../screens/CategoryView";
import AccountTypeScreen from "../screens/AccountType";
import ArtistType from "../screens/ArtistType";
import DeliveryDetails from "../screens/DeliveryDetails";
import PaymentScreen from "../screens/PaymentScreen";
import ArtPreferences from "../screens/ArtPreferences";
import DeleteAccount from "../screens/DeleteAccount";
import AccountDetails from "../screens/AccountDetails";
import EditAccountFieldScreen from "../screens/EditAccountField";
import EditProfile from "../screens/EditProfile";
import RequestOtp from "../screens/RequestOtp";
import VerifyOtp from "../screens/VerifyOtp";
import SellGuide from "../screens/SellGuide";
import GalleryView from "../components/GalleryView";
import ReviewScreen from "../screens/ReviewScreen";
import SubmitTrackingNumber from "../screens/SubmitTrackingNumber";
import OrderScreen from "../screens/OrderScreen";
import ZipCode from "../screens/ZipCode";
import StripeGate from "../screens/StripeGate"; // ⬅️ new import

export const UserNavigation = [
  { name: "Home", component: HomeScreen },
  { name: "Statisctics", component: StatisticsScreen }, // (note typo kept as in original)
  { name: "Profile", component: Profile },
  { name: "Settings", component: SettingsScreen },
  { name: "SignUp", component: SignUp },
  { name: "ImageScreen", component: ImageScreen },
  { name: "PasswordReset", component: PasswordReset },
  { name: "ArtistScreens", component: ArtistScreen },
  { name: "Upload", component: Upload },
  { name: "Categories", component: CategoriesScreen },
  { name: "Category", component: CategoryView },
  { name: "AccountType", component: AccountTypeScreen },
  { name: "ArtistType", component: ArtistType },
  { name: "ArtPreferences", component: ArtPreferences },
  { name: "DeliveryDetails", component: DeliveryDetails },
  { name: "PaymentScreen", component: PaymentScreen },
  { name: "ReviewScreen", component: ReviewScreen },
  { name: "DeleteAccount", component: DeleteAccount },
  { name: "AccountDetails", component: AccountDetails },
  { name: "EditAccountField", component: EditAccountFieldScreen },
  { name: "Login", component: Login },
  { name: "EditProfile", component: EditProfile },
  { name: "SellGuide", component: SellGuide },
  { name: "GalleryView", component: GalleryView },
  { name: "SubmitTrackingNumber", component: SubmitTrackingNumber },
  { name: "OrderScreen", component: OrderScreen },
  { name: "ZipCode", component: ZipCode },

  // ⬇️ New screen for Stripe onboarding gate
  { name: "StripeGate", component: StripeGate },
];

export const GuestNavigation = [
  // Auth screens (Login is first - initial screen for guests)
  { name: "Login", component: Login },
  { name: "RequestOtp", component: RequestOtp },
  { name: "VerifyOtp", component: VerifyOtp },
  { name: "SignUp", component: SignUp },
  { name: "PasswordReset", component: PasswordReset },
  { name: "AccountType", component: AccountTypeScreen },
  { name: "ZipCode", component: ZipCode },

  // Browsing screens (available to guests after "Continue as Guest")
  { name: "Home", component: HomeScreen },
  { name: "ImageScreen", component: ImageScreen },
  { name: "ArtistScreens", component: ArtistScreen },
  { name: "Categories", component: CategoriesScreen },
  { name: "Category", component: CategoryView },
  { name: "GalleryView", component: GalleryView },
];

export const ArtistTypes = [
  { id: 1, name: "Painter", icon: require("../assets/emojis/artistemoji.png") },
  { id: 2, name: "Photographer", icon: require("../assets/emojis/cameraemoji.png") },
  { id: 3, name: "Graphic ", secondaryName: "Designer", icon: require("../assets/emojis/graphicemoji.png") },
  { id: 4, name: "Illustrator", icon: require("../assets/emojis/writingemoji.png") },
  { id: 5, name: "Sculptor", icon: require("../assets/emojis/rockemoji.png") },
  { id: 6, name: "WoodWorker", icon: require("../assets/emojis/woodemoji.png") },
  { id: 7, name: "Graffitist", icon: require("../assets/emojis/graffitiemoji.png") },
  { id: 8, name: "Stenciler", icon: require("../assets/emojis/stencilemoji.png") },
];

export const ArtTypes = [
  { id: 1, name: "Paintings", icon: require("../assets/emojis/artistemoji.png") },
  { id: 2, name: "Photography", icon: require("../assets/emojis/cameraemoji.png") },
  { id: 3, name: "Graphic ", secondaryName: "Design", icon: require("../assets/emojis/graphicemoji.png") },
  { id: 4, name: "Illustrations", icon: require("../assets/emojis/writingemoji.png") },
  { id: 5, name: "Sculptures", icon: require("../assets/emojis/rockemoji.png") },
  { id: 6, name: "WoodWork", icon: require("../assets/emojis/woodemoji.png") },
  { id: 7, name: "Graffiti", icon: require("../assets/emojis/graffitiemoji.png") },
  { id: 8, name: "Stencils", icon: require("../assets/emojis/stencilemoji.png") },
];
