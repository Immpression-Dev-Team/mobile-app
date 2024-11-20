import React, { useCallback } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { googleConfig } from '../utils/Googleauth';
import { API_URL } from '../config';
import { showToast } from '../utils/toastNotification';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../state/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const GoogleAuthButton = ({ onAuthComplete, isSignUp = false }) => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    redirectUri: makeRedirectUri({
      native: googleConfig.redirectUri
    }),
    useProxy: true // Add this to help with CORS issues
  });

  const handleNavigation = useCallback(async (screen) => {
    try {
      console.log('Attempting navigation to:', screen);
      
      // Use CommonActions to reset the navigation state
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: screen }],
        })
      );
    } catch (error) {
      console.error('Navigation error:', error);
      showToast('Navigation failed');
    }
  }, [navigation]);

  const processAuthResult = useCallback(async (authResponse) => {
    try {
      if (!authResponse?.accessToken) {
        throw new Error('No access token received');
      }

      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authResponse.accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Received user info:', { email: userInfo.email });

      // Prepare data for backend
      const userData = {
        provider: 'google',
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        token: authResponse.accessToken
      };

      // Send to your backend
      const endpoint = isSignUp ? '/auth/google/signup' : '/auth/google/login';
      console.log('Sending to backend:', `${API_URL}${endpoint}`);

      const backendResponse = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.message || 'Backend authentication failed');
      }

      const backendResult = await backendResponse.json();

      // Prepare login data for AuthContext
      const loginData = {
        token: authResponse.accessToken,
        provider: 'google',
        user: {
          user: backendResult.user || userInfo
        }
      };

      console.log('Saving auth data...');
      await login(loginData);

      // Handle navigation
      const targetScreen = isSignUp ? 'AccountType' : 'Home';
      console.log(`Navigation target: ${targetScreen}`);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        handleNavigation(targetScreen);
      }, 100);

      // Call completion handler if provided
      if (onAuthComplete) {
        onAuthComplete(backendResult);
      }

    } catch (error) {
      console.error('Auth processing error:', error);
      showToast(error.message || 'Authentication failed');
    }
  }, [isSignUp, login, handleNavigation, onAuthComplete]);

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google auth successful, processing...');
      processAuthResult(response.authentication).catch(error => {
        console.error('Auth effect error:', error);
        showToast('Authentication failed');
      });
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      showToast('Authentication failed');
    }
  }, [response, processAuthResult]);

  const handlePress = async () => {
    try {
      console.log('Google auth button pressed');
      await promptAsync({ useProxy: true, showInRecents: true });
    } catch (error) {
      console.error('Button press error:', error);
      showToast('Failed to start authentication');
    }
  };

  return (
    <Button
      title={isSignUp ? "Sign up with Google" : "Login with Google"}
      onPress={handlePress}
      disabled={!request}
    />
  );
};

export default GoogleAuthButton;