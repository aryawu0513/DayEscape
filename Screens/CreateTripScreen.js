import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import MapView, { Marker, Callout } from "react-native-maps";
import { locations } from "../FakeData/fake_locations";
import TimePickerModal from "../Modals/TimePickerModal";
import StateContext from "../Components/StateContext";

import {
  // for Firestore access
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { emptyTrip } from "../FakeData/empty_trip";

const CreateTripScreen = (props) => {
  const [selectedPin, setSelectedPin] = useState(null);
  const [existingPlace, setExistingPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [places, setPlaces] = useState([]);
  const [canContinue, setCanContinue] = useState(null);
  const { tripProps, firebaseProps, placeProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
  const { place, setPlace, listOfPlaces, setListOfPlaces } = placeProps;
  const { db } = firebaseProps;

  async function getFirebasePlaces() {
    const q = collection(db, "places");
    try {
      // Get all documents from the "places" collection
      const querySnapshot = await getDocs(q);

      // Extract the data from each document
      const placesData = querySnapshot.docs.map((doc) => doc.data());
      setPlaces(placesData);
      setListOfPlaces(placesData);
    } catch (error) {
      console.error("Error getting places:", error.message);
      throw error;
    }
  }
  useEffect(() => {
    const canContinue = trip.places.length >= 2;
    setCanContinue(canContinue);
  }, [trip]);

  useEffect(() => {
    getFirebasePlaces();
  }, []);

  function setModal(location) {
    setSelectedPin(location);
    setModalVisible(true);
  }

  const handleMarkerPress = (location) => {
    const existingPlace = trip.places.find(
      (place) => place.name === location.name
    );
    setPlace(location);
    setExistingPlace(existingPlace);
    setModal(location);
  };

  const sortedPlaces = trip.places
    .slice()
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleText}>Create New Trip</Text>
        {modalVisible && (
          <TimePickerModal
            onCreate={setTrip}
            pin={selectedPin}
            onClose={setModalVisible}
            trip={trip}
            existingPlace={existingPlace}
          ></TimePickerModal>
        )}
        {sortedPlaces.map((place, index) => (
          <Text style={styles.places} key={index}>
            {index + 1}: {place.name}
          </Text>
        ))}
      </View>
      <Button
        mode="text"
        disabled={!canContinue}
        title="Save Note"
        textColor={"#215ED5"}
        onPress={() => props.navigation.navigate("TransportationScreen")}
      >
        Create Trip
      </Button>
      <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.34,
          longitude: -71.09,
          latitudeDelta: 0.1,
          longitudeDelta: 0.02,
        }}
      >
        {listOfPlaces &&
          listOfPlaces.map((location, index) => (
            <Marker
              key={index}
              å
              coordinate={location.coordinates}
              title={location.name}
              pinColor={
                trip.places.some((place) => place.name === location.name)
                  ? "#034BD7"
                  : "#DA8434"
              }
              onPress={() => handleMarkerPress(location)}
            />
          ))}
      </MapView>
      </View>
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
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10, 
    margin: 10,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  titleText: {
    textAlign: "center",
    fontSize: 24,
    paddingBottom: 5,
  },
  places: {
    padding: 5,
  },
});

export default CreateTripScreen;
