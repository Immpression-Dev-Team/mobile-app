import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { styles } from '../../styles/home/MiddleButtonStyles';

const MiddleButtons = () => {
  const navigation = useNavigation();

  const onCategoriesPress = () => {
    navigation.navigate('Categories');
  }

  const onTrendingPress = () => {
    navigation.navigate('Trending');
  }

  return (
    <View style={styles.container}>
      {/* Categories Button */}
      <TouchableOpacity style={styles.button} onPress={onCategoriesPress}>
        <Text style={styles.buttonText}>CATEGORIES</Text>
      </TouchableOpacity>

      {/* Trending Button */}
      <TouchableOpacity style={styles.button} onPress={onTrendingPress}>
        <Text style={styles.buttonText}>TRENDING</Text>
      </TouchableOpacity>
    </View>
  );
};



export default MiddleButtons;
