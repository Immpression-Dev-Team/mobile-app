import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const IOS_AD_UNIT_ID = 'ca-app-pub-8886964376457193/3931622326';
const ANDROID_AD_UNIT_ID = 'ca-app-pub-8886964376457193/7403963475';

// 320x100 — standard Google Large Banner, high fill rate in production
const AD_WIDTH = 320;
const AD_HEIGHT = 100;

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
} catch (_) {}

export default function InlineAdCard({ containerStyle }) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  const adUnitId = nativeAvailable
    ? __DEV__
      ? TestIds.BANNER
      : Platform.OS === 'ios' ? IOS_AD_UNIT_ID : ANDROID_AD_UNIT_ID
    : null;

  return (
    <View style={[styles.card, containerStyle]}>
      {(!nativeAvailable || adFailed || !adLoaded) && (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Text style={styles.adLabel}>Ad</Text>
        </View>
      )}
      {nativeAvailable && !adFailed && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.LARGE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={() => setAdFailed(true)}
        />
      )}
    </View>
  );
}

export { AD_WIDTH, AD_HEIGHT };

const styles = StyleSheet.create({
  card: {
    width: AD_WIDTH,
    height: AD_HEIGHT,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 6,
  },
  placeholder: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.5,
  },
});
