import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import { getUserImages, fetchLikedImages } from '../API/API';
import { useAuth } from '../state/AuthProvider';
import ScreenTemplate from '../screens/Template/ScreenTemplate';

const GalleryView = ({ route }) => {
    const { type } = route.params;
    const { userData } = useAuth();
    const token = userData?.token;
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            if (!token) return;

            try {
                if (type === 'liked') {
                    const likedImgsRes = await fetchLikedImages(token);
                    setImages(likedImgsRes?.images || []);
                } else if (type === 'selling') {
                    const res = await getUserImages(token);
                    setImages(res.images.filter((img) => img.stage === 'approved'));
                } else if (type === 'sold') {
                    const res = await getUserImages(token);
                    setImages(res.images.filter((img) => img.stage === 'sold'));
                } else if (type === 'bought') {
                    // Placeholder for future logic
                    setImages([]);
                }
            } catch (err) {
                console.error('Error fetching gallery images:', err);
            }
        };

        fetchImages();
    }, [type, token]);

    const titleMap = {
        liked: 'Favorited',
        selling: 'Gallery / Selling',
        sold: 'Sold',
        bought: 'Bought',
    };

    return (
        <ScreenTemplate>
            <View style={styles.container}>
                <Text style={styles.title}>{titleMap[type]}</Text>
                {images.length === 0 ? (
                    <Text style={styles.emptyText}>No artwork found in this folder.</Text>
                ) : (
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        contentContainerStyle={styles.gallery}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item.imageLink }} style={styles.image} />
                        )}
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
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
    },
    gallery: {
        paddingHorizontal: 10,
    },
    image: {
        width: '48%',
        height: 160,
        margin: '1%',
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16,
    },
});

export default GalleryView;