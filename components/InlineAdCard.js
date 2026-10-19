import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ensureAdsInitialized } from '../utils/ads';

// TODO: In AdMob console create two "Native" type ad units and paste the IDs here.
// These are DIFFERENT from your banner ad units — banner IDs will not work for native ads.
const IOS_NATIVE_AD_UNIT_ID = 'ca-app-pub-8886964376457193/8855235777';
const ANDROID_NATIVE_AD_UNIT_ID = 'ca-app-pub-8886964376457193/5730756289';

let NativeAd = null;
let NativeAdView = null;
let NativeMediaView = null;
let NativeAsset = null;
let NativeAssetType = null;
let TestIds = null;
let nativeAvailable = false;

try {
  const admob = require('react-native-google-mobile-ads');
  NativeAd = admob.NativeAd;
  NativeAdView = admob.NativeAdView;
  NativeMediaView = admob.NativeMediaView;
  NativeAsset = admob.NativeAsset;
  NativeAssetType = admob.NativeAssetType;
  TestIds = admob.TestIds;
  nativeAvailable = true;
} catch (_) {}

// A failed request (often no-fill) is retried after these delays before the
// card gives up and stays a placeholder.
const RETRY_DELAYS_MS = [5000, 20000];

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
    let retryTimer = null;

    const load = (attempt) => {
      ensureAdsInitialized()
        .then((canPersonalize) =>
          NativeAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: !canPersonalize })
        )
        .then((ad) => {
          if (mounted) {
            loadedAd = ad;
            setNativeAd(ad);
          } else {
            ad.destroy();
          }
        })
        .catch(() => {
          if (!mounted) return;
          if (attempt < RETRY_DELAYS_MS.length) {
            retryTimer = setTimeout(() => load(attempt + 1), RETRY_DELAYS_MS[attempt]);
          } else {
            setAdFailed(true);
          }
        });
    };

    load(0);

    return () => {
      mounted = false;
      clearTimeout(retryTimer);
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
      {/* AdMob native policy requires the headline to be shown and registered */}
      <View style={styles.headlineBar}>
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={styles.headline} numberOfLines={1}>
            {nativeAd.headline}
          </Text>
        </NativeAsset>
      </View>
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
  headlineBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  headline: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
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
