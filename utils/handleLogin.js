import axios from 'axios';
import { API_URL } from '../config';

export const handleLogin = async (email, password, navigation) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true },
    );
    console.log(response);
    if (response.data.success) {
      navigation.navigate('Home');
    } else {
      console.log('Login failed');
    }
  } catch (err) {
    console.log('Error during login:', err);
  }
};
