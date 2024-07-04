import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
  } from "react-native";
  import React, { useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import NavBar from "../components/Navbar";
  import axios from "axios";
  import { API_URL } from '../config';

function PasswordReset() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();
  return (
    <View style={styles.container}>
    {/* <NavBar /> */}
    <View style={styles.contentContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Reset Your Password</Text>
          {/* <TextInput placeholder="Username" value={userName} onChangeText={text => setUserName(text)} style={styles.input} /> */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Old Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="New Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  </View>
  )
}

export default PasswordReset