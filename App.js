import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navbar from './components/Navbar';
import HomeScreen from './screens/Home';
import StatisticsScreen from './screens/Statistics';
import GalleryScreen from './screens/Gallery';
import SettingsScreen from './screens/Settings';

const Stack = createStackNavigator();

const WelcomeScreen = () => {
  return(
    <View>
    <Text>Welcome to Immpression</Text>
  </View>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
        <Navbar />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
