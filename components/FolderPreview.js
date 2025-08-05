import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const IMAGE_HEIGHT = CARD_WIDTH; // Square

const FolderPreview = ({ title, images = [], onPress }) => {
  const hasImage = images.length > 0;
  const image = images[0];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        {hasImage ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Art</Text>
          </View>
        )}
        <View style={styles.countTag}>
          <Text style={styles.countText}>{images.length}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  placeholderText: {
    color: '#666',
    fontSize: 13,
  },
  countTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#000000aa',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },
});

export default FolderPreview;
