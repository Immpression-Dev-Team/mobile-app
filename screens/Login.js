import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/Navbar'
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  
  const navigation = useNavigation();

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:4000/login', {email, userName, password})
    .then(result => {
      console.log(result)
      if(result.data === "success"){
        back('/')
      }
    })
    .catch(err => console.log(err))
  }

  const navigateTo = (screenName) => {
      navigation.navigate(screenName);
  };
  
  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.contentContainer}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Welcome to Immpression</Text>
            <TextInput placeholder="Username" value={userName} onChangeText={text => setUserName(text)} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
            <TextInput placeholder="Password" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => {handleSubmit}} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("SignUp")} style={[styles.button, styles.buttonOutline]}>
                <Text style={styles.buttonOutlineText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the very top
    alignItems: 'center',
    paddingTop: 20, // Adjust the top padding to create space between NavBar and Login content
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonOutline: {
    backgroundColor: 'red',
    marginTop: 10,
    borderRadius: 10,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
})