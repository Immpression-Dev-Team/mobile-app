import { useEffect, useState } from "react";
import * as TrackingTransparency from "expo-tracking-transparency";

// Module-level cache: the ATT prompt (iOS only — Android/web resolve
// immediately with no real prompt) should only ever be requested once per
// app session, and every ad component needs the same answer.
let cached = null; // null = not yet resolved
let inFlight = null;

export function ensureTrackingPermission() {
  if (cached !== null) return Promise.resolve(cached);
  if (inFlight) return inFlight;

  inFlight = TrackingTransparency.requestTrackingPermissionsAsync()
    .then(({ status }) => {
      cached = status === "granted";
      return cached;
    })
    .catch(() => {
      cached = false;
      return cached;
    });

  return inFlight;
}

// Whether ads can be requested as personalized right now. Starts false
// (the safe/compliant default) and flips once the real ATT status resolves.
export function useCanRequestPersonalizedAds() {
  const [canPersonalize, setCanPersonalize] = useState(cached === true);

  useEffect(() => {
    let mounted = true;
    ensureTrackingPermission().then((result) => {
      if (mounted) setCanPersonalize(result);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return canPersonalize;
}
