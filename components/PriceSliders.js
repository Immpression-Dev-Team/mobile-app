import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../state/AuthProvider";

const PriceSliders = ({ imageId }) => {
  const [bidPrice, setBidPrice] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    // Fetch current bid
    const fetchCurrentBid = async () => {
      try {
        const response = await axios.get(`${API_URL}/current-bid/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentBid(response.data.currentBid);
      } catch (error) {
        console.error("Error fetching current bid:", error);
      }
    };

    fetchCurrentBid();
  }, [imageId]);

  const handleBidSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/place-bid/${imageId}`,
        { bidAmount: bidPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentBid(response.data.newBid);
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <View style={{ alignItems: "center", padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Current Bid: ${currentBid.toFixed(2)}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Bid: ${bidPrice.toFixed(2)}</Text>
      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={currentBid + 1}
        maximumValue={10000}
        step={1}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#4CAF50"
        value={bidPrice}
        onValueChange={(value) => setBidPrice(value)}
      />
      <Button title="Place Bid" onPress={handleBidSubmit} />
    </View>
  );
};

export default PriceSliders;
