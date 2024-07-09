import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from '../config';
import Icon from "react-native-vector-icons/FontAwesome"; 

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    // Handle submit logic here
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login'); // Assumes you have a route named 'Login' in your navigator
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Reset Your Password</Text>
        
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={14} color="#000" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TextInput
          placeholder="New Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
        <Pressable onPress={handleBackToLogin} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    width: '90%',
    // backgroundColor: 'white',
    padding: 20,
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6C7DE',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 60,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 11,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default PasswordReset;
