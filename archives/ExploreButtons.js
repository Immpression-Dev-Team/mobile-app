import { View, StyleSheet, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import NavButton from '../components/home_sections/Explore/NavButton';

export default function ExploreButtons() {
  const navigation = useNavigation();

  const buttons = [
    { text: 'CATEGORIES', link: 'Categories' },
    { text: 'TRENDING', link: 'Trending' }
  ];

  return (
    <View style={styles.container}>
      {
        buttons.map((item, index) => (
          <NavButton
            key={index}
            btnText={item.text}
            handler={() => navigation.navigate(item.link)}
          />
        ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: (Platform.OS === 'web') ? '1%' : '2.5%',
    paddingHorizontal: 7.5,
    gap: 7.5,
  },
});