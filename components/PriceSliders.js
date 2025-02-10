import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { getCurrentBid, placeBid } from "../API/API";
import { useAuth } from "../state/AuthProvider";
const arrowIcon = require("../assets/icons/arrow-down.png");

const PriceSliders = ({ imageId }) => {
  const [bidPrice, setBidPrice] = useState(0);
  const [topBid, setTopBid] = useState(0);
  const [myBid, setMyBid] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    if (!imageId) return;

    const fetchBid = async () => {
      const data = await getCurrentBid(imageId, token);
      if (data.currentBid !== undefined) {
        setTopBid(data.currentBid);
        setMyBid(data.myBid || 0);
        setBidPrice(data.currentBid + 1);
      }
    };

    fetchBid();
  }, [imageId, token]);

  const handleBidSubmit = async () => {
    if (!imageId) return;

    const data = await placeBid(imageId, bidPrice, token);
    if (data.newBid !== undefined) {
      setTopBid(data.newBid);
      setMyBid(data.newBid);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bid & My Bid - Side by Side with Auto-Sized Gray Blocks */}
      <View style={styles.bidInfoContainer}>
        <View style={styles.bidBox}>
          <Text style={styles.bidValue}>${topBid.toFixed(2)}</Text>
          <Text style={styles.bidLabel}>TOP BID</Text>
        </View>
        <View style={styles.bidBox}>
          <Text style={styles.bidValue}>
            ${myBid > 0 ? myBid.toFixed(2) : "0"}
          </Text>
          <Text style={styles.bidLabel}>MY BID</Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={topBid + 1}
        maximumValue={150}
        step={1}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#e3a702"
        value={bidPrice}
        onValueChange={(value) => setBidPrice(value)}
      />

      <View style={styles.bidButtonContainer}>
        <View style={styles.bidTextContainer}>
          <Text style={styles.newBidText}>YOUR NEW BID: ${bidPrice.toFixed(2)}</Text>
          <Text style={styles.buyInstantlyText}>BUY IT INSTANTLY.</Text>

          {/* Overlay Arrow Image */}
          <Image source={arrowIcon} style={styles.arrowDown} />
        </View>

        <TouchableOpacity style={styles.placeBidButton} onPress={handleBidSubmit}>
          <Text style={styles.placeBidText}>PLACE BID</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
};

export default PriceSliders;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: "100%",
  },
  bidInfoContainer: {
    flexDirection: "row", // Side by side
    alignItems: "center",
    justifyContent: "flex-start", // Align everything to the left
    gap: 5, // Space between Top Bid and My Bid
  },
  bidBox: {
    backgroundColor: "#E0E0E0", // Gray background
    paddingVertical: 1,
    paddingHorizontal: 3,
    alignItems: "flex-start", // Align text to the left
    justifyContent: "center",
  },
  bidValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bidLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "gray",
    marginTop: 3,
  },
  slider: {
    width: "100%",
    height: 30,
  },
  bidButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  newBidText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "blue",
    backgroundColor: '#E0E0E0',
    paddingVertical: 2,
  },
  placeBidButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 2,
    borderWidth: 1,
  },
  placeBidText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buyInstantlyContainer: {
    width: "100%", // Ensures it spans the full width
  },

  buyInstantlyText: {
    fontSize: 12,
    color: "#333",

  },

  arrowDown: {
    width: 30, // Adjust size as needed
    height: 30,
    position: "absolute",
    right: -30, // Moves it slightly outside the text for an overlay effect
    top: "70%", // Adjust vertical position
    transform: [{ translateY: -8 }], // Fine-tune exact positioning
  },
});
