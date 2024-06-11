import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ArtQuotes = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // List of art quotes
  const quotes = [
    "Art washes away from the soul the dust of everyday life. - Pablo Picasso",
    "Every artist was first an amateur. - Ralph Waldo Emerson",
    "Art enables us to find ourselves and lose ourselves at the same time. - Thomas Merton",
    // Add more quotes as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random index for the next quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuoteIndex(randomIndex);
    }, 5000); // Change interval as needed (5 seconds)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>{quotes[currentQuoteIndex]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
  },
  quoteText: {
    fontSize: 15,
    textAlign: 'left', // Align text to the left
    fontStyle: 'italic',
    marginHorizontal: 20,
  },
});

export default ArtQuotes;
