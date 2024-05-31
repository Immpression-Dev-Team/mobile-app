import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

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
        <View style={styles.section}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Discover Artists</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    headerContainer: {
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginBottom: 10,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 3, // Margin between columns
    },
    artistContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 2, // Margin between images in a column
        borderRadius: 50, // Half of width and height to make it circular
    },
    artistName: {
        fontSize: 11,
        marginTop: 5,
    },
});

export default FeaturedArtists;
