import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Text, Pressable, FlatList, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
    const { images, initialIndex } = route.params;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item.path} style={styles.fullImage} />
            <Text style={styles.artTitle}>{item.artTitle}</Text>
            <Text style={styles.artistName}>{item.artistName}</Text>
            <Text style={styles.artYear}>{item.artYear}</Text>
            <Text style={styles.artType}>{item.artType}</Text>
            <Text style={styles.artDescription}>{item.artDescription}</Text>
        </View>
    );

    const Pagination = () => {
        return (
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View key={index} style={[styles.dot, currentIndex === index && styles.dotActive]} />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
            <FlatList
                data={images}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                initialScrollIndex={initialIndex}
                getItemLayout={(data, index) => (
                    { length: width, offset: width * index, index }
                )}
            />
            <Pagination />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    closeButtonText: {
        color: 'black',
        fontSize: 24,
    },
    imageContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    fullImage: {
        width: 300,
        height: 300,
        resizeMode: 'cover',
        marginVertical: 20,
    },
    artTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    artistName: {
        fontSize: 18,
        textAlign: 'center',
    },
    artYear: {
        fontSize: 18,
        textAlign: 'center',
    },
    artType: {
        fontSize: 18,
        textAlign: 'center',
    },
    artDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    dot: {
        height: 10,
        width: 10,
        backgroundColor: '#888',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    dotActive: {
        backgroundColor: '#000',
    },
});

export default ImageScreen;
