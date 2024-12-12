import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared.');
  } catch (error) {
    console.error('Failed to clear AsyncStorage:', error);
  }
};

export default clearAsyncStorage;

/**
 * Function: clearAsyncStorage
 * ---------------------------
 * This function clears all the data stored in AsyncStorage, a key-value storage system used
 * to persist data locally in the app. This is particularly useful when you need to reset
 * cached data (e.g., user tokens, app settings) during development or when fixing bugs.
 *
 * Usage:
 * - Temporarily call this function during app initialization to clear stored data.
 * - Import at the top of `App.js` for quick access and call it (temporarily).
 * - Remove or comment out the function call after resolving any issues requiring it.
 *
 * Example:
 * - Import and call this function in `App.js` or your app's entry file:
 *
 *   import clearAsyncStorage from './utils/clearAsyncStorage';
 *   clearAsyncStorage();
 *
 * Notes:
 * - Do NOT leave this function active in production, as it will reset all local data
 *   every time the app is initialized.
 * - Use this cautiously to avoid disrupting normal user experiences.
 */
