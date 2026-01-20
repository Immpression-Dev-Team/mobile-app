import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../state/AuthProvider';
import { getBlockedUsers, unblockUser } from '../API/API';
import ScreenTemplate from './Template/ScreenTemplate';

const BlockedUsersScreen = () => {
  const navigation = useNavigation();
  const { token, userData } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);

  const fetchBlockedUsers = async () => {
    try {
      const result = await getBlockedUsers(token);
      if (result.success) {
        setBlockedUsers(result.data.blockedUsers || []);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBlockedUsers();
    }
  }, [token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBlockedUsers();
  }, [token]);

  const handleUnblock = async (userId, userName) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName || 'this user'}? They will be able to appear in your feed again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: async () => {
            setUnblockingId(userId);
            try {
              const result = await unblockUser(userId, token);
              if (result.success) {
                setBlockedUsers((prev) =>
                  prev.filter((user) => user.userId !== userId)
                );
              } else {
                Alert.alert('Error', result.error || 'Failed to unblock user');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred. Please try again.');
            } finally {
              setUnblockingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isUnblocking = unblockingId === item.userId;

    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Image
            source={
              item.profilePictureLink
                ? { uri: item.profilePictureLink }
                : require('../assets/user.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
            <Text style={styles.blockedDate}>
              Blocked {new Date(item.blockedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.unblockButton}
          onPress={() => handleUnblock(item.userId, item.name)}
          disabled={isUnblocking}
        >
          {isUnblocking ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.unblockText}>Unblock</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-remove-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Blocked Users</Text>
      <Text style={styles.emptyText}>
        When you block someone, they will appear here. Blocked users won't be
        able to see your content in their feed.
      </Text>
    </View>
  );

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Blocked Users</Text>
          <View style={styles.placeholder} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={blockedUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId || item.blockId}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={
              blockedUsers.length === 0 ? styles.emptyListContainer : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  blockedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  unblockText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default BlockedUsersScreen;
