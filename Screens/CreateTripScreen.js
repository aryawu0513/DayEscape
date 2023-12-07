import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
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
      <View style={styles.informationContainer}>
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
          <Text key={index}>
            {index + 1}: {place.name}
          </Text>
        ))}
      </View>
      <Button
        title="Create Trip"
        onPress={() => props.navigation.navigate("TransportationScreen")}
      />
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
              coordinate={location.coordinates}
              title={location.name}
              pinColor={
                trip.places.some((place) => place.name === location.name)
                  ? "blue"
                  : "red"
              }
              onPress={() => handleMarkerPress(location)}
            />
          ))}
      </MapView>
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
  informationContainer: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  titleText: {
    fontSize: 20,
  },
});

export default CreateTripScreen;
