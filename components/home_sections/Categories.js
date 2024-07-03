import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from 'react-native';

const categoryLabels = ["Sketches", "Photography"]; // Define category labels here
const backgroundImage1 = require('../../assets/thumbnails/sketches.png'); // Import your first background image
const backgroundImage2 = require('../../assets/thumbnails/photography.png'); // Import your second background image
const headerImage = require('../../assets/headers/Trending_Categories_multi.png'); // Import your header image

const Categories = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
            </View>
            <View style={styles.container}>
                {categoryLabels.map((label, index) => (
                    <Pressable key={index} style={styles.box}>
                        {index === 0 ? (
                            <ImageBackground source={backgroundImage1} style={styles.backgroundImage} imageStyle={styles.image}>
                                <Text style={styles.label}>{label}</Text>
                            </ImageBackground>
                        ) : index === 1 ? (
                            <ImageBackground source={backgroundImage2} style={styles.backgroundImage} imageStyle={styles.image}>
                                <Text style={styles.label}>{label}</Text>
                            </ImageBackground>
                        ) : (
                            <View style={styles.boxWithoutImage}>
                                <Text style={styles.label}>{label}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center', // Align all items to the left
    },
    headerContainer: {
        width: '100%',
        alignItems: 'flex-start', // Align the header image to the left
        marginLeft: 50,
    },
    headerImage: {
        width: 230, // Adjust the width as needed
        height: 40, // Adjust the height as needed
        resizeMode: 'contain', // Adjust to fit the image properly
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    box: {
        width: '46%',
        height: 100,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    image: {
        // borderRadius: 10,
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Categories;
