import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import NavBar from '../components/Navbar'
import SearchBar from '../components/SearchBar'


const Divider = () => {
  return (
    <View style={{ height: 2, backgroundColor: '#ddd', marginHorizontal: 8, marginVertical: 16 }} />
  );
};

const StatisticsScreen = () => {
  const [buttonA, setButtonA] = useState(true)
  const [buttonB, setButtonB] = useState(false)

  const buttonShow = (button) => {
    console.log(button === buttonA)
  }

  

  return (
    <ScrollView style={styles.container}>
      <NavBar />

      <View style={styles.box}>
        
        <View style={styles.statButtonContainer}>
          <TouchableOpacity onPress={buttonShow(buttonA)} id='buttonA' style={[buttonA ? styles.buttonShow : styles.statButton ]}>
            <Text style={styles.statText}>Similar Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={buttonShow(buttonB)} id='buttonB' style={buttonB ? styles.buttonShow : styles.statButton}>
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

      <View style={[styles.box2]}>
        <Text style={[styles.centerAlign, { marginLeft: 8, marginTop: 20 }]}>Price Appreciation of Similar Works</Text>
        <Text style={[{ fontSize: 30, fontWeight: '400', marginLeft: 8 }]}>21.8%</Text>
        <Divider />
        <View style={styles.statIndividual}>
          <Text>Sharpe Ratio (1995-2023)</Text>
          <View style={{ display: 'flex', flexDirection: 'row', margin: 0}}>
            <TouchableOpacity style={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-around', padding: 0, margin: 0}}>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>Watch Video</Text>
            </TouchableOpacity>
            <Image 
              source={require('../assets/question.png')}
              style={styles.logo}
            />
          </View>
        </View>
        <Divider />
        <View style={styles.statIndividual}>
          <Text>Jean-Michel Basquiat</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Image 
              source={require('../assets/up-arrow.jpeg')}
              style={styles.logo}
            />
            <Text>
              1.23
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.statIndividual}>
          <Text>All Art</Text>
          <Text>0.37</Text>
        </View>
        <Divider />
        <View style={styles.statIndividual}>
          <Text>S&P 500</Text>
          <Text>0.52</Text>
        </View>
        <Divider />
        <View>
          <Text>
            <Image 
              source={{ uri: 'https://www.shutterstock.com/image-vector/93-loading-progress-bar-infographics-260nw-2148395211.jpg' }}
              style={{ height: 30, width: 450, resizeMode: 'center' }}
            />
          </Text>
          <Button 
            title='MEMBERS ONLY'
          />
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  buttonShow: {
    borderWidth: 2,
    borderRadius: 22,
    borderColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  box: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    margin: 8,
    height: 500
  },
  box2: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    margin: 8,
    height: 400
  },
  pr: {
    paddingLeft: 18,
    paddingTop: 14
  },
  statButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 14
  },
  statIndividual: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 8
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
  },
  centerAlign: {
    alignSelf: 'flex-start'
  }
});

export default StatisticsScreen;
