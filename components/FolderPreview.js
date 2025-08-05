import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.28;
const PREVIEW_BOX_WIDTH = width * 0.4;
const PREVIEW_BOX_HEIGHT = IMAGE_SIZE + 10;

const FolderPreview = ({ title, images = [], onPress }) => {
  // console.log('title', title);
  // console.log('images from folder', JSON.stringify(images, null, 2));

  const count = images.length;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.previewBox}>
        {count > 0 ? (
          <View style={styles.imageStack}>
            {images.slice(0, 3).map((img, index) => (
              <Image
                key={Math.random() * 100}
                source={{ uri: img }}
                style={[
                  styles.image,
                  {
                    left: index * (IMAGE_SIZE * 0.35),
                    zIndex: 3 - index,
                  },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyPlaceholder}>
            <Text style={styles.emptyText}>No Art</Text>
          </View>
        )}
        <Text style={styles.countOverlay}>{count}</Text>
      </View>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginVertical: 12,
    alignItems: 'center',
  },
  previewBox: {
    width: PREVIEW_BOX_WIDTH,
    height: PREVIEW_BOX_HEIGHT,
    position: 'relative',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStack: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
  },
  emptyPlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  emptyText: {
    fontSize: 12,
    color: '#666',
  },
  countOverlay: {
    position: 'absolute',
    bottom: -2,
    right: 13,
    backgroundColor: '#333',
    color: 'white',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
    zIndex: 99,
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FolderPreview;
