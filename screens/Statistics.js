import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import Navbar from '../components/Navbar';
import statsBrush from '../assets/icons/stats_brush.png';
import FooterNavbar from '../components/FooterNavbar';

const StatisticsScreen = () => {
  // const imagePaths = [
  //   { uri: 'https://via.placeholder.com/150', artistName: '@OnlineArtist', views: 123 },
  //   { path: require('../assets/art/art5.png'), artistName: '@Artist1', views: 456 },
  //   { path: require('../assets/art/art2.png'), artistName: '@Artist2', views: 789 },
  //   { path: require('../assets/art/batman.png'), artistName: '@BruceWayne', views: 101 },
  //   { path: require('../assets/art/art3.png'), artistName: '@Artist3', views: 202 },
  //   { path: require('../assets/art/art4.png'), artistName: '@Artist4', views: 303 },
  //   { path: require('../assets/art/art1.jpg'), artistName: '@Artist5', views: 404 },
  //   { path: require('../assets/art/art6.png'), artistName: '@Artist6', views: 505 },
  //   { path: require('../assets/photos/mountain.jpg'), artistName: '@Artist7', views: 606 },
  //   { path: require('../assets/photos/grass.jpg'), artistName: '@Artist8', views: 707 },
  //   { path: require('../assets/photos/building.jpg'), artistName: '@Artist9', views: 808 },
  //   { path: require('../assets/photos/man.jpg'), artistName: '@Artist10', views: 909 },
  //   { path: require('../assets/photos/hand.jpg'), artistName: '@Artist11', views: 1001 },
  //   { path: require('../assets/photos/gray.jpg'), artistName: '@Artist12', views: 1102 },
  //   { path: require('../assets/photos/path.jpg'), artistName: '@Artist13', views: 1203 },
  //   { path: require('../assets/photos/animal.jpg'), artistName: '@Artist14', views: 1304 },
  //   { path: require('../assets/photos/sunset.jpg'), artistName: '@Artist15', views: 1405 },
  //   { path: require('../assets/photos/deer.jpg'), artistName: '@Artist16', views: 1506 },
  //   { path: require('../assets/art/superman.png'), artistName: '@Clark Kent', views: 1607 },
  //   { path: require('../assets/art/spiderman.png'), artistName: '@PeterParker', views: 1708 },
  //   { path: require('../assets/art/tajmahal.jpeg'), artistName: '@NavjotKaur', views: 1809 },
  // ];

  return (
    <>
      <Navbar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          {imagePaths.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={image.path ? image.path : { uri: image.uri }}
                  style={styles.image}
                  onError={(error) => console.log(`Failed to load image at index ${index}: ${error.nativeEvent.error}`)}
                />
                <Image
                  source={statsBrush}
                  style={styles.overlay}
                />
              </View>
              {/* <Text style={styles.artistName}>{image.artistName}</Text> */}
              <Text style={styles.views}>{image.views} eyes</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FooterNavbar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 110,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artistName: {
    textAlign: 'center',
    marginTop: 5,
  },
  views: {
    textAlign: 'center',
    marginTop: 2,
    color: 'black',
  },
});

export default StatisticsScreen;
