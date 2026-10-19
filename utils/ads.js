import { ensureTrackingPermission } from "./trackingPermission";

let mobileAds = null;
try {
  mobileAds = require("react-native-google-mobile-ads").default;
} catch (_) {}

let initPromise = null;

// Initializes the Google Mobile Ads SDK once per app session. Waits for the
// ATT answer first (iOS) so the SDK starts with the user's real tracking
// status. Resolves to whether personalized ads may be requested; never rejects,
// so a failed init still lets ad components try to load.
export function ensureAdsInitialized() {
  if (initPromise) return initPromise;

  initPromise = ensureTrackingPermission().then(async (canPersonalize) => {
    if (mobileAds) {
      try {
        await mobileAds().initialize();
      } catch (_) {}
    }
    return canPersonalize;
  });

  return initPromise;
}
