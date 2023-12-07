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
import PersistentNote from "../Components/PersistentNote";
import TripNote from "../Components/TripNote";

const TripInfoScreen = (props) => {
  const { selectedTripProps, firebaseProps } = useContext(StateContext);
  const { selectedTrip, setSelectedTrip, hasDelete, setHasDelete } = selectedTripProps;
  const { db } = firebaseProps;

  // Assuming that route.params.tripId contains the ID of the selected trip
  const tripId = selectedTrip.createTime;

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
      setSelectedTrip(tripData);
    } catch (error) {
      console.error("Error fetching trip:", error.message);
      throw error;
    }
  }

  // Function to delete the trip
  const deleteTrip = async () => {
    const q = doc(db, "trips", tripId);
    await Promise.all(
      selectedTrip.places.map(async (place) => {
        const q_place = doc(db, "places", place.id);
        const querySnapshot = await getDoc(q_place);
        const placeData = querySnapshot.data();
        placeData.routes = placeData.routes.filter((id) => id !== tripId);
        await updateDoc(q_place, placeData);
      })
    );
    await deleteDoc(q);
    //setSelectedTrip(emptyTrip);
    // Navigate back to the previous screen
    setHasDelete(true);
    props.navigation.goBack();
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Display Trip Name */}
        <Text style={styles.tripName}>{selectedTrip.tripName}</Text>

        {/* Delete Button */}
        <Button title="Delete Trip" onPress={deleteTrip} />

        {/* Map Component */}
        <View style={styles.mapContainer}>
          <MapWithTrip trip={selectedTrip} style={styles.map} />
        </View>

        {/* Related Notes */}
        <Text style={styles.sectionTitle}>Related Notes:</Text>
        {/* Loop through trip.notes and display relevant information */}

        {/* You can map through trip.notes here and display relevant information */}
        <TripNote tripId={tripId}></TripNote>
      </ScrollView>
    </>
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
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  mapContainer: {
    flex: 1,
    height: 400, // Set a specific height or adjust as needed
  },
  map: {
    flex: 1, // Adjust the flex value as needed
    ...StyleSheet.absoluteFillObject,
    width: "100%", // Set the width to take up the entire space
    height: 300, // Set a specific height or adjust as needed
  },
});

export default TripInfoScreen;
