import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapWithTrip from "../Components/MapWithTrip";
import AddNameModal from "../Modals/AddNameModal";
import StateContext from "../Components/StateContext";
import { emptyTrip } from "../FakeData/empty_trip";

const SaveTripScreen = (props) => {
  const { tripProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
  console.log("This is trip", trip);
  console.log("This is name", trip.tripName);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveTrip = (tripName) => {
    // call helper function to save the trip with the provided tripName
    updateTripNameTime(trip, tripName);
    //need to save the trip to firebase
    closeModal();
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

  // Example of a generic function to update the trip name
  function updateTripNameTime(trip, tripName) {
    setTrip({
      ...trip,
      tripName: tripName,
      createTime: new Date().toISOString(), // Add timestamp
    });
  }

  return (
    <View style={styles.container}>
      <Text>This is the SaveTripScreen!</Text>
      <Text>{trip.tripName}</Text>
      <MapWithTrip trip={trip} />

      {/* Save Trip Button */}
      <Button title="Save Trip" onPress={openModal} />

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
});

export default SaveTripScreen;
