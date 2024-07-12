import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleLogin = async (email, password, setUserData, navigation, login) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true },
    );
    console.log(response);
    if (response.data.success) {
      await login(response.data)
      setUserData(response.data); // Immediately set user data in the context
      navigation.navigate('Home'); // Navigate to the Home screen
    } else {
      console.log('Login failed');
    }
  } catch (err) {
    console.log('Error during login:', err);
  }
};
