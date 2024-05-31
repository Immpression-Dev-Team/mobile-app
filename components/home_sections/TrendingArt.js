import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const imagePaths = [
    require('../../assets/photos/path.jpg'),
    require('../../assets/photos/animal.jpg'),
    require('../../assets/photos/sunset.jpg'),
    require('../../assets/photos/deer.jpg'),
    require('../../assets/art/art1.jpg'),
    require('../../assets/art/art2.png'),
    require('../../assets/art/art3.png'),
    require('../../assets/art/art4.png'),
    require('../../assets/art/art5.png'),
    require('../../assets/art/art6.png'),
    //   require('../../assets/art/art7.png'),
    //   require('../../assets/art/art8.png'),
    require('../../assets/photos/building.jpg'),
    require('../../assets/photos/man.jpg'),
    require('../../assets/photos/hand.jpg'),
    require('../../assets/photos/gray.jpg'),
    // Add more images if needed
];

const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
};

const TrendingArt = () => {
    const imageChunks = chunkArray(imagePaths, 2); // Chunk into groups of 3 images

    return (
        <View style={styles.section}>
          <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <Text style={styles.header}>Trending Art</Text>
                </View>
                <View style={styles.rightHeader}>
                    <Text style={styles.secondaryHeader}>More</Text>
                </View>
            </View>
            <ScrollView horizontal style={styles.scrollView}>
                {imageChunks.map((chunk, chunkIndex) => (
                    <View key={chunkIndex} style={styles.column}>
                        {chunk.map((path, index) => (
                            <Image
                                key={index}
                                source={path}
                                style={styles.image}
                            />
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
        marginTop: 20,
    },
    headerContainer: {
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center items
        marginBottom: 2,
        alignSelf: 'flex-start', // Make sure the container's width wraps around the text
        // backgroundColor: '#007AFF',
        // borderRadius: 3,
        // paddingVertical: 5,
        // paddingHorizontal: 10,
    },
    leftHeader: {
        backgroundColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 2,
        borderTopLeftRadius: 10,
    },
    rightHeader: {
        backgroundColor: '#B7C9E2',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderTopRightRadius: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 158, // Add some space between the titles
    },
    secondaryHeader: {
        fontSize: 15,
        color: 'black',
    },
    scrollView: {
        flexDirection: 'row',
    },
    column: {
        marginRight: 2, // Margin between columns
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 2, // Margin between images in a column
        borderRadius: 0,
    },
});

export default TrendingArt;
