import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapWithTrip from "../Components/MapWithTrip";
import AddNameModal from "../Modals/AddNameModal";
import StateContext from "../Components/StateContext";
import { emptyTrip } from "../FakeData/empty_trip";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const SaveTripScreen = (props) => {
  const { tripProps, firebaseProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
  // console.log("This is trip", trip);
  // console.log("This is name", trip.tripName);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaveButtonClicked, setSaveButtonClicked] = useState(false);

  async function addTripToDB(inputTrip, timestampString) {
    try {
      const newTrip = { ...inputTrip, createTime: timestampString };
      await setDoc(doc(firebaseProps.db, "trips", timestampString), newTrip);
      setTrip(newTrip);
    } catch (error) {
      console.error("Error adding trip:", error.message);
      throw error;
    }
  }

  async function addNotesToTrip(inputTrip) {
    const timestamp = new Date().getTime();
    const timestampString = timestamp.toString();
    const notes = [];
    try {
      await Promise.all(
        trip.places.map(async (place) => {
          const doc_note = doc(firebaseProps.db, "persistent_notes", place.id);
          const doc_place = doc(firebaseProps.db, "places", place.id);

          const querySnapshot_note = await getDoc(doc_note);
          const querySnapshot_place = await getDoc(doc_place);

          const placeData = querySnapshot_place.data();
          const noteData = querySnapshot_note.data();

          console.log("placeData", placeData);
          console.log("placeData.routes", placeData.routes);
          // Check if placeData.routes is an iterable array
          const routesArray = Array.isArray(placeData.routes)
            ? placeData.routes
            : [];

          const newData = {
            routes: [...routesArray, timestampString], // Set your updated value here
          };

          notes.push(noteData);
          await updateDoc(doc_place, newData);
        })
      );
      const newTrip = { ...inputTrip, notes: notes };
      await addTripToDB(newTrip, timestampString);
    } catch (error) {
      console.error("Error adding notes to trip:", error.message);
      throw error;
    }
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSaveButtonClicked(true);
  };

  const saveTrip = async (tripName) => {
    // call helper function to save the trip with the provided tripName
    const newTrip = { ...trip, tripName: tripName };
    //need to save the trip to firebase
    closeModal();
    await addNotesToTrip(newTrip);
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Trips" }],
    });
  };

  const deleteTrip = () => {
    // Implement the logic to delete the trip=not saving the trip = erasing the trip info??
    //need to go back to the CreateTripScreen
    // manually set the trip object to the empty trip object
    props.navigation.navigate("CreateTripScreen");
    console.log("Deleting trip:");
    setTrip(emptyTrip);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Details of Trip {trip.tripName}</Text>
      {/* Save Trip Button */}
      <Button
        title="Save Trip"
        onPress={openModal}
        disabled={isSaveButtonClicked}
      />

      <MapWithTrip trip={trip} />

      {/* AddNameModal */}
      <AddNameModal
        visible={modalVisible}
        onDelete={deleteTrip}
        onSave={(name) => {
          saveTrip(name);
        }}
        trip={trip.params}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 2,
    width: "100%",
    height: "100%",
  },

  titleText: {
    fontSize: 20,
  },
});

export default SaveTripScreen;
