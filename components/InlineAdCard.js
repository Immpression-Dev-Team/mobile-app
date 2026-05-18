import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const IOS_AD_UNIT_ID = 'ca-app-pub-8886964376457193/3931622326';
const ANDROID_AD_UNIT_ID = 'ca-app-pub-8886964376457193/7403963475';

let BannerAd = null;
let TestIds = null;
let nativeAvailable = false;

try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  TestIds = admob.TestIds;
  nativeAvailable = true;
} catch (_) {}

export default function InlineAdCard({ width, height, containerStyle }) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  const adUnitId = nativeAvailable
    ? __DEV__
      ? TestIds.BANNER
      : Platform.OS === 'ios' ? IOS_AD_UNIT_ID : ANDROID_AD_UNIT_ID
    : null;

  return (
    <View style={[styles.card, { width, height }, containerStyle]}>
      {(!nativeAvailable || adFailed || !adLoaded) && (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
          <Text style={styles.adLabel}>Ad</Text>
        </View>
      )}
      {nativeAvailable && !adFailed && (
        <BannerAd
          unitId={adUnitId}
          size={`${width}x${height}`}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={() => setAdFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
