import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

export default function NotificationDropdown({ notifications, onClose }) {
  return (
    <View style={styles.dropdown}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet</Text>
        }
      />
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 15,
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 999,
  },
  notificationCard: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#007BFF',
    fontSize: 14,
  },
});
