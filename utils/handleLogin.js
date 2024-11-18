import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../utils/toastNotification';

export const handleLogin = async (
  email,
  password,
  // setUserData,
  // navigation,
  login
) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );

    if (response.data.success) {
      await login(response.data);
      return { success: true }; // Return success status
      // setUserData(response.data); // Immediately set user data in the context
      // showToast('Login Successful');
      // navigation.navigate('Home'); // Navigate to the Home screen
    } else {
      showToast('Login Failed');
      console.log('Login failed');
      return { success: false, error: response.data.message }; // Return failure with error
    }
  } catch (err) {
    showToast('Error During Login');
    console.log('Error during login:', err.response.data);
  }
};
