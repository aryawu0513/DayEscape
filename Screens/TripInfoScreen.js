import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
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

import { Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const TripInfoScreen = (props) => {
  const { selectedTripProps, firebaseProps } = useContext(StateContext);
  const {
    selectedTrip,
    setSelectedTrip,
    hasDelete,
    setHasDelete,
  } = selectedTripProps;
  const { db } = firebaseProps;
  const [image, setImage] = useState(null); 

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
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  
  return (
    <>
      <ScrollView style={styles.container}>
        {/* Display Trip Name */}
        <Text style={styles.tripName}>{selectedTrip.tripName}</Text>

        {/* Delete Button */}
        <Button mode="text" onPress={deleteTrip} textColor={"#215ED5"}>
          Delete Trip
        </Button>
        
        {/* Image Picker Button */}
        <Button mode="text" onPress={pickImage} textColor={"#215ED5"}>
         Pick related image
         </Button>

        {/* Display selected image */}
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
       
        {/* Map Component */}
        <View style={styles.mapContainer}>
          <MapWithTrip trip={selectedTrip} style={styles.map} />
        </View>

        {/* Related Notes */}
        <Text style={styles.sectionTitle}>Related Notes</Text>
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
    marginTop: 20,
    marginBottom: 30,
  },
  tripName: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 8,
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  mapContainer: {
    flex: 1,
    height: 400,
    margin: 20, 
    marginBottom: 40,
  },
  map: {
    flex: 1, // Adjust the flex value as needed
    ...StyleSheet.absoluteFillObject,
    width: "100%", // Set the width to take up the entire space
    height: 300, // Set a specific height or adjust as needed
  },
});

export default TripInfoScreen;
