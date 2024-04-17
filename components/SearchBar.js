import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'

const SearchBar = () => {
  return (
    <View style={styles.Whole}>
    <View style={styles.Main} >
        <TextInput placeholder="search" style={styles.Input}></TextInput>
        <TouchableOpacity style={styles.Button}>
            <AntDesign name="search1" size={25}></AntDesign>
        </TouchableOpacity>
    </View>
</View>
  )
}

export default SearchBar


const styles = StyleSheet.create({
    Main: {
        flexDirection: "row",
        alignItems: "center", // Align items horizontally
        backgroundColor: "#fff",
        width: 250,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        marginRight: 5,
        marginVertical: 20
    },
    Input: {
        flex: 1, // Take up remaining space
        marginLeft: 10,
        marginTop: 5
    },
    Button: {
        height: 40,
        width: 40,
        border: "none",
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    Whole: {
        flexDirection: "row"
    }
})