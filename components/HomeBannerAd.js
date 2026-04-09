import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const IOS_AD_UNIT_ID = 'ca-app-pub-8886964376457193/3931622326';
const ANDROID_AD_UNIT_ID = 'ca-app-pub-8886964376457193/7403963475';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? IOS_AD_UNIT_ID
  : ANDROID_AD_UNIT_ID;

export default function HomeBannerAd() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
});
