import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ArtistScreen = ({ route }) => {
    const navigation = useNavigation();
    const { images, artist, profilePic, initialIndex } = route.params;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const flatListRef = useRef(null);

    useEffect(() => {
        // Scroll to the initial index when component mounts
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
        }
      }, [initialIndex]);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item.path} style={styles.fullImage} />
        </View>
    );

    const onViewRef = useRef(({ changed }) => {
        const current = changed.find(item => item.isViewable);
        if (current) {
            setCurrentIndex(current.index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
            )}
            showsHorizontalScrollIndicator={false}
        />
            <View style={styles.card}>
                <Text style={styles.artistName}>{images[currentIndex].artist}</Text>
                <Image source={profilePic} style={styles.image} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'red',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        width: '90%',
        backgroundColor: 'gray',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: '100%', // Make image width 100% of the card width
        height: 400,
        borderRadius: 0,
        marginTop: 10, // To provide some space between the artist name and the image
    },
    artistName: {
        fontSize: 24,
        marginTop: 10,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
});

export default ArtistScreen;