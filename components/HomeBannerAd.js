import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const IOS_AD_UNIT_ID = 'ca-app-pub-8886964376457193/3931622326';
const ANDROID_AD_UNIT_ID = 'ca-app-pub-8886964376457193/7403963475';

// Safely check if the native AdMob module is available (not in Expo Go)
let BannerAd = null;
let BannerAdSize = null;
let TestIds = null;
let nativeAvailable = false;

try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
  nativeAvailable = true;
} catch (_) {
  nativeAvailable = false;
}

export default function HomeBannerAd() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  const adUnitId = nativeAvailable
    ? __DEV__
      ? TestIds.BANNER
      : Platform.OS === 'ios'
      ? IOS_AD_UNIT_ID
      : ANDROID_AD_UNIT_ID
    : null;

  return (
    <View style={styles.container}>
      {/* Placeholder shown until ad loads, if it fails, or in Expo Go */}
      {(!adLoaded || !nativeAvailable) && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>AD</Text>
        </View>
      )}
      {nativeAvailable && !adFailed && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={() => setAdFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  placeholder: {
    width: '100%',
    height: 60,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 2,
  },
});
