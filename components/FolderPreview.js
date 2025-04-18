import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FolderPreview = ({ title, images = [], onPress }) => {
  const count = images.length;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.previewBox}>
        {count > 0 ? (
          <View style={styles.imageStack}>
            {images.slice(0, 3).map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={[
                  styles.image,
                  {
                    left: index * 20,
                    zIndex: 3 - index,
                  },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyPlaceholder}>
            <Text style={styles.emptyText}>No images</Text>
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
    width: '45%',
    margin: 10,
    alignItems: 'center',
  },
  previewBox: {
    width: 100,
    height: 70,
    position: 'relative',
    marginBottom: 8,
  },
  imageStack: {
    flexDirection: 'row',
    position: 'absolute',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
  },
  emptyPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'absolute',
  },
  emptyText: {
    fontSize: 12,
    color: '#666',
  },
  countOverlay: {
    position: 'absolute',
    right: -10,
    bottom: -5,
    backgroundColor: '#333',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default FolderPreview;
