import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const IOS_AD_UNIT_ID = 'ca-app-pub-8886964376457193/3931622326';
const ANDROID_AD_UNIT_ID = 'ca-app-pub-8886964376457193/7403963475';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? IOS_AD_UNIT_ID
  : ANDROID_AD_UNIT_ID;

export default function HomeBannerAd() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Placeholder shown until ad loads or if it fails */}
      {!adLoaded && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>AD</Text>
        </View>
      )}
      {!adFailed && (
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
