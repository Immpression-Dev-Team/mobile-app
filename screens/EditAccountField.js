import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ScreenTemplate from "./Template/ScreenTemplate"; 

const EditAccountFieldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { field, value } = route.params;
  const [input, setInput] = useState(value);

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>{field}</Text>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <Text style={styles.label}>{field}</Text>
        <TextInput 
          style={styles.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder={`Enter new ${field.toLowerCase()}`} 
          autoCapitalize="none"
        />
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  backButton: {
    padding: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  nextButton: {
    padding: 5,
  },
  nextText: {
    fontSize: 16,
    color: "#888",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
});

export default EditAccountFieldScreen;
