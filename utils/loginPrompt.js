import { Alert } from "react-native";

/**
 * Shows a login prompt to guest users and navigates to login screen
 * @param {object} navigation - React Navigation object
 * @param {string} actionName - Name of the action being attempted (e.g., "like this artwork", "make a purchase")
 */
export const promptLogin = (navigation, actionName = "perform this action") => {
  Alert.alert(
    "Login Required",
    `Please log in to ${actionName}.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log In",
        onPress: () => navigation.navigate("Login"),
        style: "default",
      },
    ],
    { cancelable: true }
  );
};

/**
 * Check if user is authenticated (has token)
 * @param {string} token - Auth token from useAuth
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = (token) => {
  return !!token;
};
