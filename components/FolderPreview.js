import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FolderPreview = ({ title, count, images = [], onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageStack}>
        {images.slice(0, 3).map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={[styles.image, { marginLeft: index * -10, zIndex: -index }]}
          />
        ))}
      </View>
      <Text style={styles.label}>{title} | {count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    margin: 10,
    alignItems: 'center',
  },
  imageStack: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default FolderPreview;
