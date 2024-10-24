import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import DiscoverButton from '../DiscoverButton'; // Adjust the path as needed
import styles from '../../styles/home/ArtOfTheDayStyles';

const headerImage = require('../../assets/headers/Art_of_the_day.png'); // Import the header image

const ArtOfTheDay = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={headerImage} style={styles.headerImage} />
                <Pressable
                    style={styles.rightHeader}
                    onPress={() => setIsAutoScrolling((prev) => !prev)}
                >
                    <DiscoverButton />
                </Pressable>
            </View>
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/art/art5.png')} // Replace with your image path
                    style={styles.artImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.artTitle}>Self Love</Text>
                    <Text style={styles.artistName}>Marcus Morales</Text>
                    <Text style={styles.artPrice}>$55</Text>
                </View>
            </View>
        </View>
    );
};


export default ArtOfTheDay;
