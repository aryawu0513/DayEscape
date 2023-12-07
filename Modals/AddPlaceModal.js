import React, { useState, useContext } from "react";
import StateContext from "../Components/StateContext";
import MapView, { Marker } from "react-native-maps";
import { doc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

function AddPlaceModal({ onClose }) {
  const [name, setName] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  // const [longitude, setLongitude] = useState("");
  // const [latitude, setLatitude] = useState("");
  const { firebaseProps, placeProps } = useContext(StateContext);

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
      coordinates: coordinates,
      routes: [],
    };

    placeProps.setListOfPlaces((prev) => {
      return [...prev, newPlace];
    });
    onClose(false);
    await addPlaceToDB(newPlace, timestampString, newNote);
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
  const handleMapClick = (event) => {
    const { coordinate } = event.nativeEvent;
    setCoordinates(coordinate);
  };

  function handleClose() {
    onClose(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalViewWrapper}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="times" size={20} color="#333" />
          </TouchableOpacity>
          <TextInput
            placeholder="Enter name..."
            value={name}
            style={styles.textInput}
            onChangeText={(value) => setName(value)}
          />
          <MapView
            style={styles.map}
            onPress={handleMapClick}
            initialRegion={{
              latitude: 42.34,
              longitude: -71.09,
              latitudeDelta: 0.1,
              longitudeDelta: 0.02,
            }}
          >
            {coordinates && (
              <Marker coordinate={coordinates} title="Selected Location" />
            )}
          </MapView>
          <Button title="Create" onPress={() => closeModal()} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    height: 300,
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
  map: {
    flex: 1,
    width: "80%",
    height: 200,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default AddPlaceModal;
