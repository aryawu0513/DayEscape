import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapWithTrip from "../Components/MapWithTrip";
import StateContext from "../Components/StateContext";
import { emptyTrip } from "../FakeData/empty_trip";
import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const TripInfoScreen = (props) => {
  const { tripProps, firebaseProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
  const { db } = firebaseProps;

  // Assuming that route.params.tripId contains the ID of the selected trip
  const tripId = trip.createTime;

  useEffect(() => {
    getTrip();
  }, []);

  // Find the selected trip based on tripId
  async function getTrip() {
    const q = doc(db, "trips", tripId);
    try {
      // Construct the reference to the specific trip document
      const querySnapshot = await getDoc(q);
      const tripData = querySnapshot.data();
      setTrip(tripData);
    } catch (error) {
      console.error("Error fetching trip:", error.message);
      throw error;
    }
  }

  // Function to delete the trip
  const deleteTrip = async () => {
    const q = doc(db, "trips", tripId);
    await deleteDoc(q);
    setTrip(emptyTrip);
    // Navigate back to the previous screen
    props.navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display Trip Name */}
      <Text style={styles.tripName}>{trip.tripName}</Text>

      {/* Delete Button */}
      <Button title="Delete Trip" onPress={deleteTrip} />

      {/* Map Component */}
      <MapWithTrip trip={trip} />

      {/* Related Notes */}
      <Text style={styles.sectionTitle}>Related Notes:</Text>
      {/* Loop through trip.notes and display relevant information */}

      {/* You can map through trip.notes here and display relevant information */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  tripName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  map: {
    height: 200,
    marginBottom: 8,
  },
});

export default TripInfoScreen;
