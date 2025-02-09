import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Slider from "@react-native-community/slider";
import { getCurrentBid, placeBid } from "../API/API";
import { useAuth } from "../state/AuthProvider";

const PriceSliders = ({ imageId }) => {
  const [bidPrice, setBidPrice] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    if (!imageId) return;

    const fetchBid = async () => {
      const data = await getCurrentBid(imageId, token);
      if (data.currentBid !== undefined) {
        setCurrentBid(data.currentBid);
      }
    };

    fetchBid();
  }, [imageId]);

  const handleBidSubmit = async () => {
    if (!imageId) return;

    const data = await placeBid(imageId, bidPrice, token);
    if (data.newBid !== undefined) {
      setCurrentBid(data.newBid);
    }
  };

  return (
    <View style={{ alignItems: "center", padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Current Bid: ${currentBid.toFixed(2)}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Your Bid: ${bidPrice.toFixed(2)}
      </Text>
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
