import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TVButton from '../TVButton'; // Import the TVButton component

const categoryLabels = ["Sketches", "Photography", "Sculptures", "Paintings"]; // Define category labels here
const backgroundImage1 = require('../../assets/thumbnails/sketches.png'); // Import your first background image
const backgroundImage2 = require('../../assets/thumbnails/photography.png'); // Import your second background image
const backgroundImage3 = require('../../assets/thumbnails/sculptures.png'); // Import your third background image
const backgroundImage4 = require('../../assets/thumbnails/paintings.png'); // Import your fourth background image
const headerImage = require('../../assets/headers/Trending_Categories_multi.png'); // Import your header image

const Categories = () => {
    return (
        <LinearGradient colors={['white', '#acb3bf', 'white']} style={styles.section}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <Pressable style={styles.rightHeader}>
                    <TVButton />
                </Pressable>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    {categoryLabels.map((label, index) => {
                        let backgroundImage;
                        switch(index) {
                            case 0:
                                backgroundImage = backgroundImage1;
                                break;
                            case 1:
                                backgroundImage = backgroundImage2;
                                break;
                            case 2:
                                backgroundImage = backgroundImage3;
                                break;
                            case 3:
                                backgroundImage = backgroundImage4;
                                break;
                            default:
                                backgroundImage = backgroundImage1;
                        }

                        return (
                            <Pressable key={index} style={styles.box}>
                                <ImageBackground 
                                    source={backgroundImage} 
                                    style={styles.backgroundImage} 
                                    imageStyle={styles.image}>
                                    <Text style={styles.label}>{label}</Text>
                                </ImageBackground>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    section: {
        width: '98%',
        marginTop: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 5,
    },
    headerImage: {
        width: 264,
        height: 52,
        resizeMode: 'contain',
        marginBottom: -3,
    },
    rightHeader: {
        marginLeft: 'auto', // Pushes the TV button to the right
        marginRight: 10,
    },
    mainContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center', // Align all items to the center
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    box: {
        width: '48%',
        height: 100,
        margin: 2,
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
