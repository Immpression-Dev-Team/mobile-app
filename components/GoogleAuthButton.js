import React, { useCallback } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { googleConfig } from '../utils/Googleauth';
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
    useProxy: true
  });

  const handleNavigation = useCallback((screen) => {
    console.log('Navigating to:', screen);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screen }],
      })
    );
  }, [navigation]);

  const processAuthResult = useCallback(async (authResponse) => {
    try {
      console.log('Processing Google auth response');
      
      // Get user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${authResponse.accessToken}` }
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Received user info:', userInfo);

      // Prepare login data
      const loginData = {
        token: authResponse.accessToken,
        provider: 'google',
        user: {
          user: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture
          }
        }
      };

      // Save to auth context
      console.log('Saving auth data');
      await login(loginData);

      // Navigate based on isSignUp flag
      const targetScreen = isSignUp ? 'AccountType' : 'Home';
      console.log(`Navigating to ${targetScreen}`);
      handleNavigation(targetScreen);

      if (onAuthComplete) {
        onAuthComplete(loginData);
      }

    } catch (error) {
      console.error('Auth error:', error);
      showToast('Authentication failed');
    }
  }, [isSignUp, login, handleNavigation, onAuthComplete]);

  React.useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      processAuthResult(response.authentication);
    }
  }, [response, processAuthResult]);

  return (
    <Button
      title={isSignUp ? "Sign up with Google" : "Login with Google"}
      onPress={() => {
        console.log('Starting Google auth');
        promptAsync();
      }}
      disabled={!request}
    />
  );
};

export default GoogleAuthButton;