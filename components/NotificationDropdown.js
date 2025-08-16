import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NotificationDropdown({ notifications, onClose }) {
  const navigation = useNavigation();

  const handleNotificationPress = (notification) => {
    if (notification.type === 'purchase' && notification.orderData) {
      navigation.navigate('SubmitTrackingNumber', {
        orderData: notification.orderData
      });
      onClose();
    }
  };

  return (
    <View style={styles.dropdown}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            style={[
              styles.notificationCard,
              item.type === 'purchase' && styles.purchaseNotification
            ]}
            onPress={() => handleNotificationPress(item)}
          >
            <Text style={[
              styles.notificationText,
              item.type === 'purchase' && styles.purchaseNotificationText
            ]}>
              {item.message}
            </Text>
          </Pressable>
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
  purchaseNotification: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 3,
    borderLeftColor: '#28A745',
  },
  purchaseNotificationText: {
    color: '#155724',
    fontWeight: '600',
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
