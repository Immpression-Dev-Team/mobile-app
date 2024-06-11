import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import the header image
import discoverHeader from '../../assets/headers/Discover.png';

const imagePaths = [
    require('../../assets/artists/artist1.png'),
    require('../../assets/artists/artist2.png'),
    require('../../assets/artists/artist9.png'),
    require('../../assets/artists/artist3.png'),
    require('../../assets/artists/artist12.png'),
    require('../../assets/artists/artist6.png'),
    require('../../assets/artists/artist4.png'),
    require('../../assets/artists/artist7.png'),
    require('../../assets/artists/artist8.png'),
    require('../../assets/artists/artist10.png'),
    require('../../assets/artists/artist5.png'),
    require('../../assets/artists/artist11.png'),
    require('../../assets/artists/artist13.png'),
    require('../../assets/artists/artist14.png'),
    require('../../assets/artists/artist15.png'),
    require('../../assets/artists/artist16.png'),
];

const artistNames = [
    'Emma Brown',
    'Liam Johnson',
    'Olivia Williams',
    'Noah Jones',
    'Sophia Davis',
    'William Miller',
    'Isabella Wilson',
    'Ethan Moore',
    'Ava Taylor',
    'James Anderson',
    'Amelia Thomas',
    'Oliver Martinez',
    'Mia Taylor',
    'Benjamin Clark',
    'Charlotte Rodriguez',
    'Elijah Lee',
];

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const FeaturedArtists = () => {
    const imageChunks = chunkArray(imagePaths, 1); // Chunk into groups of 1 image

    return (
        <LinearGradient colors={['white', '#b5d1ff', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={discoverHeader} style={styles.headerImage} />
            </View>
            <ScrollView horizontal style={styles.scrollView}>
                {imageChunks.map((chunk, chunkIndex) => (
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((path, index) => (
                            <View key={index} style={styles.artistContainer}>
                                <Image
                                    source={path}
                                    style={styles.image}
                                />
                                <Text style={styles.artistName}>{artistNames[Math.floor(Math.random() * artistNames.length)]}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    headerContainer: {
        borderRadius: 3,
        paddingVertical: 0,
        paddingHorizontal: 8,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    headerImage: {
        width: 250,
        height: 50,
        resizeMode: 'contain',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 10,
    },
    artistContainer: {
        alignItems: 'center',
        marginBottom: 5,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 2,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    artistName: {
        fontSize: 11,
        marginTop: 5,
    },
});

export default FeaturedArtists;
