import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapWithTrip from "../Components/MapWithTrip";
import AddNameModal from "../Modals/AddNameModal";
import StateContext from "../Components/StateContext";

const SaveTripScreen = () => {
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
    updateTripName(trip, tripName);
    closeModal();
  };

  const deleteTrip = () => {
    // Implement the logic to delete the trip
    console.log("Deleting trip:", tripName);
    closeModal();
  };

  // Example of a generic function to update the trip name
  function updateTripName(trip, tripName) {
    setTrip({
      ...trip,
      tripName: tripName,
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
        onClose={closeModal}
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
