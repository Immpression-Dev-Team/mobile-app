import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    <View style={styles.inputContainer}>
      <Text style={styles.Title}>Sign Up to Immpression</Text>
      <TextInput placeholder="email" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
      <TextInput placeholder="password" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry />
      <TextInput placeholder="confirm password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} style={styles.input} secureTextEntry />
    </View>

    <View style={styles.buttonContainer}>

      <TouchableOpacity onPress={() => {}} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
  Title: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center"
  },
  inputContainer: {
      width: "80%"
  },
  input: {
      backgroundColor: "lightgray",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 10
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  button: {
    backgroundColor: "blue",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    color: "white"
  },
  buttonText: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: 'center',
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  },
  buttonOutline: {
    backgroundColor: "red",
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: 'center'
  },
  buttonOutlineText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  }
})