import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../state/AuthProvider';
import { getAllImages, getAllProfilePictures, searchPublicDomainArt } from '../API/API';

const PUBLIC_PAGE_SIZE = 10;

export default function HomeSearchResults({ searchQuery }) {
  const { token } = useAuth();
  const navigation = useNavigation();

  // Art + Artists — fetched once on mount, filtered locally
  const [baseData, setBaseData] = useState([]);
  const [baseLoading, setBaseLoading] = useState(true);

  // Public domain — fetched from API on each query change, lazy loaded
  const [publicResults, setPublicResults] = useState([]);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicLoadingMore, setPublicLoadingMore] = useState(false);
  const [publicLimit, setPublicLimit] = useState(PUBLIC_PAGE_SIZE);
  const [publicHasMore, setPublicHasMore] = useState(true);
  const lastQueryRef = useRef('');

  // Fetch art + artists once on mount
  useEffect(() => {
    const fetchBase = async () => {
      setBaseLoading(true);
      try {
        const [artRes, artistRes] = await Promise.all([
          getAllImages(token, 1, 50),
          getAllProfilePictures(token),
        ]);
        const artItems = (artRes.success
          ? artRes.images.filter((img) => img.stage === 'approved')
          : []
        ).map((art) => ({ ...art, _type: 'art' }));

        const artistItems = (Array.isArray(artistRes) ? artistRes : []).map(
          (artist) => ({ ...artist, _type: 'artist' })
        );

        setBaseData([...artItems, ...artistItems]);
      } catch (e) {
        console.error('HomeSearchResults base fetch error:', e);
      } finally {
        setBaseLoading(false);
      }
    };
    fetchBase();
  }, [token]);

  // Fetch public domain results whenever query changes
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setPublicResults([]);
      return;
    }

    lastQueryRef.current = q;
    setPublicResults([]);
    setPublicLimit(PUBLIC_PAGE_SIZE);
    setPublicHasMore(true);

    const fetchPublic = async () => {
      setPublicLoading(true);
      try {
        const res = await searchPublicDomainArt(q, 'all', PUBLIC_PAGE_SIZE);
        if (lastQueryRef.current !== q) return; // stale, discard
        const items = (res.success ? res.data : []).map((pub) => ({
          ...pub,
          _type: 'public',
        }));
        setPublicResults(items);
        setPublicHasMore(items.length === PUBLIC_PAGE_SIZE);
      } catch (e) {
        console.error('HomeSearchResults public fetch error:', e);
      } finally {
        setPublicLoading(false);
      }
    };

    fetchPublic();
  }, [searchQuery]);

  const loadMorePublic = async () => {
    const q = searchQuery.trim();
    if (!q || publicLoadingMore || !publicHasMore) return;

    const newLimit = publicLimit + PUBLIC_PAGE_SIZE;
    setPublicLoadingMore(true);
    try {
      const res = await searchPublicDomainArt(q, 'all', newLimit);
      if (lastQueryRef.current !== q) return;
      const items = (res.success ? res.data : []).map((pub) => ({
        ...pub,
        _type: 'public',
      }));
      setPublicResults(items);
      setPublicLimit(newLimit);
      setPublicHasMore(items.length >= newLimit);
    } catch (e) {
      console.error('HomeSearchResults load more public error:', e);
    } finally {
      setPublicLoadingMore(false);
    }
  };

  const q = searchQuery.toLowerCase().trim();

  const filteredBase = baseData.filter((item) => {
    if (item._type === 'art') {
      return (
        (item.name || item.title || '').toLowerCase().includes(q) ||
        (item.artistName || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
      );
    }
    if (item._type === 'artist') {
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.artistType || '').toLowerCase().includes(q)
      );
    }
    return false;
  });

  const allResults = [...filteredBase, ...publicResults];

  const handlePress = (item) => {
    if (item._type === 'art') {
      const artList = baseData.filter((d) => d._type === 'art');
      navigation.navigate('ImageScreen', {
        images: artList,
        initialIndex: artList.findIndex((d) => d._id === item._id),
      });
    } else if (item._type === 'artist') {
      navigation.navigate('ArtistScreens', {
        artist: item.name,
        profilePic: item.profilePictureLink,
        type: item.artistType,
        galleryImages: baseData.filter((d) => d._type === 'artist'),
        initialIndex: 0,
      });
    } else if (item._type === 'public') {
      navigation.navigate('PublicDomainImageScreen', {
        artworks: publicResults,
        initialIndex: publicResults.findIndex((d) => d.id === item.id),
      });
    }
  };

  const renderItem = ({ item }) => {
    const imageUri =
      item._type === 'art'
        ? item.imageLink
        : item._type === 'artist'
        ? item.profilePictureLink
        : item.thumbnailUrl || item.imageUrl;

    const badge =
      item._type === 'art' ? 'Art' : item._type === 'artist' ? 'Artist' : 'Public Art';
    const badgeColor =
      item._type === 'art' ? '#635BFF' : item._type === 'artist' ? '#10B981' : '#F59E0B';

    if (item._type === 'art') {
      const price = typeof item.price === 'number' ? item.price : null;
      const isSold = item.soldStatus === 'sold' || item.isSold;
      return (
        <TouchableOpacity style={styles.row} onPress={() => handlePress(item)} activeOpacity={0.7}>
          <Image source={{ uri: imageUri }} style={styles.thumbnail} contentFit="cover" transition={150} cachePolicy="memory-disk" />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{item.name || item.title || 'Untitled'}</Text>
            {!!item.artistName && <Text style={styles.subtitle} numberOfLines={1}>by {item.artistName}</Text>}
            <View style={styles.metaRow}>
              {price !== null && (
                <Text style={[styles.price, isSold && styles.priceSold]}>
                  {isSold ? 'Sold' : `$${price.toFixed(2)}`}
                </Text>
              )}
              {!!item.category && <Text style={styles.category}>{item.category}</Text>}
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: badgeColor + '20', borderColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item._type === 'public') {
      return (
        <TouchableOpacity style={styles.row} onPress={() => handlePress(item)} activeOpacity={0.7}>
          <Image source={{ uri: imageUri }} style={styles.thumbnail} contentFit="cover" transition={150} cachePolicy="memory-disk" />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{item.title || 'Untitled'}</Text>
            {!!item.artist && <Text style={styles.subtitle} numberOfLines={1}>by {item.artist}</Text>}
            <View style={styles.metaRow}>
              {!!item.year && <Text style={styles.category}>{item.year}</Text>}
              {!!item.museum && <Text style={styles.category} numberOfLines={1}>{item.museum}</Text>}
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: badgeColor + '20', borderColor: badgeColor }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Artist
    return (
      <TouchableOpacity style={styles.row} onPress={() => handlePress(item)} activeOpacity={0.7}>
        <Image source={{ uri: imageUri }} style={styles.thumbnail} contentFit="cover" transition={150} cachePolicy="memory-disk" />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.name || 'Unknown'}</Text>
          {!!item.artistType && <Text style={styles.subtitle} numberOfLines={1}>{item.artistType}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: badgeColor + '20', borderColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (publicLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#635BFF" />
        </View>
      );
    }
    return null;
  };

  if (baseLoading || publicLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#635BFF" />
      </View>
    );
  }

  if (allResults.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No results for "{searchQuery}"</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allResults}
      keyExtractor={(item, index) => `${item._type}-${item._id || item.id || index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      style={styles.flatList}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={loadMorePublic}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  list: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#635BFF',
  },
  priceSold: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  category: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
