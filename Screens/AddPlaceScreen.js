import React, { useState, useContext } from "react";
import StateContext from "../Components/StateContext";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";

const GOOGLE_PLACES_API_KEY = "AIzaSyAQMcmDiMbdLgywZvfayW2h1B6p5gR7vhQ";
const { width } = Dimensions.get("window");

const AddPlaceScreen = (navigationProps) => {
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [region, setRegion] = useState({
    latitude: 42.34,
    longitude: -71.09,
    latitudeDelta: 0.1,
    longitudeDelta: 0.02,
  });
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const { firebaseProps, placeProps } = useContext(StateContext);

  const updateRegion = (latitude, longitude) => {
    setRegion({
      ...region,
      latitude,
      longitude,
    });
  };

  const handleMapClick = (event) => {
    const { coordinate } = event.nativeEvent;
    setLat(coordinate.latitude);
    setLong(coordinate.longitude);
  };

  async function closeModal() {
    const timestamp = new Date().getTime();
    const timestampString = timestamp.toString();

    const newNote = {
      id: timestampString,
      place: name,
      note_description: "",
    };

    const newPlace = {
      id: timestampString,
      name: name,
      coordinates: { longitude: long, latitude: lat },
      routes: [],
    };

    placeProps.setListOfPlaces((prev) => {
      return [...prev, newPlace];
    });
    setModal(false);
    await addPlaceToDB(newPlace, timestampString, newNote);
    navigationProps.navigation.navigate("PlacesScreen");
  }

  async function addPlaceToDB(newPlace, timestampString, newNote) {
    try {
      // Add a new place in collection "places"
      await setDoc(doc(firebaseProps.db, "places", timestampString), newPlace);

      await setDoc(
        doc(firebaseProps.db, "persistent_notes", timestampString),
        newNote
      );
    } catch (error) {
      console.error("Error adding place and note:", error.message);
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search for a place</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en", // language of the results
        }}
        fetchDetails={true}
        onPress={(data, details = null) => {
          setName(details.name);
          setLong(details.geometry.location.lng);
          setLat(details.geometry.location.lat);
          updateRegion(
            details.geometry.location.lat,
            details.geometry.location.lng
          );
        }}
        onFail={(error) => console.error(error)}
        requestUrl={{
          url:
            "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
          useOnPlatform: "web",
        }}
        styles={{
          container: {
            position: "absolute",
            paddingTop: 40,
            padding: 10,
            left: 0,
            right: 0,
            zIndex: 999,
          },
        }}
      />
      <Text style={styles.textAfter}>Or put down a pin on the map</Text>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region} onPress={handleMapClick}>
          {lat && long && (
            <Marker
              coordinate={{ latitude: lat, longitude: long }}
              title="Selected Location"
            />
          )}
        </MapView>
      </View>
      <Button
        mode="text"
        // onPress={() => setModal(true)}
        onPress={() => setModal(true)}
        textColor={"#215ED5"}
      >
        Create
      </Button>
      {modal && (
        <Modal
          animationType="slide"
          transparent
          visible={true}
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalViewWrapper}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Enter a name..."
                value={name}
                style={styles.textInput}
                onChangeText={(value) => setName(value)}
              />
              <Button
                mode="text"
                onPress={() => closeModal()}
                textColor={"#215ED5"}
              >
                Add New Place!
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ecf0f1",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "50%",
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    width: "100%",
    height: 400,
  },
  text: {
    padding: 5,
  },
  textAfter: {
    padding: 5,
    paddingTop: 60,
  },
  modalViewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 200,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    fontSize: 20,
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    margin: 8,
  },
});

export default AddPlaceScreen;
