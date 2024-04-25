import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import NavBar from '../components/Navbar'


const Divider = () => {
  return (
    <View style={{ height: 2, backgroundColor: '#ddd', marginHorizontal: 10 }} />
  );
};

const StatisticsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <NavBar />

      <View style={styles.box}>
        
        <View style={styles.statButtonContainer}>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statText}>Similar Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statText}>Record Price</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Image
            style={[styles.images, {marginTop: 15}]}
            source={{ uri: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}}
          />
        </View>
      </View>

      <View style={styles.box}>
        <Text>Price Appreciation of Similar Works</Text>
        <Text>21.8%</Text>
        <Divider />
        <View>
          <Text>Sharpe Ratio (1995-2023)</Text>
          <TouchableOpacity>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>Watch Video</Text>
          </TouchableOpacity>
          <Image 
            source={require('../assets/question.png')}
            style={styles.logo}
          />
        </View>
        <Divider />
        <View>
          <Text>Jean-Michel Basquiat</Text>
          <Text>
            <Image 
              source={require('../assets/up-arrow.png')}
              style={styles.logo}
            />
            1.23
          </Text>
        </View>
        <Divider />
        <View>
          <Text>All Art</Text>
          <Text>0.37</Text>
        </View>
      </View>
      <Divider />
      <View>
        <Text>S&P 500</Text>
        <Text>0.52</Text>
      </View>
      <View>
        <Text>
          93%
          <Text>Progress</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  box: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    margin: 8,
    height: 500
  },
  statButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 14
  },
  statButton: {
    borderWidth: 2,
    borderRadius: 22,
    borderColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statText: {
    textAlign: 'center',
    minWidth: 100
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
  images: {
    height: 400,
    width: 350,
    alignSelf: 'center'
  },
  logo: {
    width: 15,
    height: 15,
  }
});

export default StatisticsScreen;
