import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// TODO: In AdMob console create two "Native" type ad units and paste the IDs here.
// These are DIFFERENT from your banner ad units — banner IDs will not work for native ads.
const IOS_NATIVE_AD_UNIT_ID = 'ca-app-pub-8886964376457193/XXXXXXXXXX';
const ANDROID_NATIVE_AD_UNIT_ID = 'ca-app-pub-8886964376457193/XXXXXXXXXX';

let NativeAd = null;
let NativeAdView = null;
let NativeMediaView = null;
let TestIds = null;
let nativeAvailable = false;

try {
  const admob = require('react-native-google-mobile-ads');
  NativeAd = admob.NativeAd;
  NativeAdView = admob.NativeAdView;
  NativeMediaView = admob.NativeMediaView;
  TestIds = admob.TestIds;
  nativeAvailable = true;
} catch (_) {}

export default function InlineAdCard({ width, height, containerStyle }) {
  const [nativeAd, setNativeAd] = useState(null);
  const [adFailed, setAdFailed] = useState(false);

  const adUnitId = nativeAvailable
    ? __DEV__
      ? TestIds.NATIVE
      : Platform.OS === 'ios'
      ? IOS_NATIVE_AD_UNIT_ID
      : ANDROID_NATIVE_AD_UNIT_ID
    : null;

  useEffect(() => {
    if (!nativeAvailable || !adUnitId) return;

    let mounted = true;
    let loadedAd = null;

    NativeAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: false })
      .then((ad) => {
        if (mounted) {
          loadedAd = ad;
          setNativeAd(ad);
        } else {
          ad.destroy();
        }
      })
      .catch(() => {
        if (mounted) setAdFailed(true);
      });

    return () => {
      mounted = false;
      loadedAd?.destroy();
    };
  }, [adUnitId]);

  if (!nativeAvailable || adFailed || !nativeAd) {
    return (
      <View style={[styles.placeholder, { width, height }, containerStyle]}>
        <Text style={styles.adLabel}>Ad</Text>
      </View>
    );
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={[styles.card, { width, height }, containerStyle]}>
      <NativeMediaView style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Ad</Text>
      </View>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 6,
  },
  placeholder: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.5,
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
