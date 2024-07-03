import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import NavBar from '../components/Navbar'
import { API_URL } from '../config';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";


const SignUp = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")

const navigation = useNavigation();

// TODO: set up frontend confirmPassword logic before calling handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${API_URL}/signup`, { name, email, password}
      ); console.log(response);
      if (response.data.success) {
        navigation.navigate("Home");
      } else {
        console.log("Login failed");
      }
    } catch (err) {
      console.log("Error during login:", err);
    }
  };
  
  return (
    <View style={styles.container}>
      <NavBar />
      <KeyboardAvoidingView style={styles.signUpContainer} behavior="padding">
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Sign Up to Impression</Text>
          <TextInput placeholder="name" value={name} onChangeText={text => setName(text)} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
          <TextInput placeholder="Password" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry />
          {/* <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} style={styles.input} secureTextEntry /> */}
        </View>
        <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust the top padding to create space between NavBar and Sign Up section
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    width: '80%',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: 'red',
    marginTop: 20,
    borderRadius: 10,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
})