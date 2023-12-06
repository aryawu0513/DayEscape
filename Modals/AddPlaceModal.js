import React, { useState, useContext } from "react";
import StateContext from "../Components/StateContext";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Button,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

function AddPlaceModal({ onClose }) {
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const { firebaseProps, placeProps } = useContext(StateContext);

  async function closeModal() {
    const timestamp = new Date().getTime();
    const timestampString = timestamp.toString();

    const newNote = {
      id: timestampString,
      place: name,
      note_description: "",
      related_trip: null,
    };
    
    const newPlace = {
      id: timestampString,
      name: name,
      coordinates: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
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

      await setDoc(doc(firebaseProps.db, "persistent_notes", timestampString), newNote);
    } catch (error) {
      console.error("Error adding place and note:", error.message);
      throw error;
    }
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
          <TextInput
            placeholder="Enter name..."
            value={name}
            style={styles.textInput}
            onChangeText={(value) => setName(value)}
          />
          <TextInput
            placeholder="Latitude"
            value={latitude}
            style={styles.textInput}
            onChangeText={(value) => setLatitude(value)}
          />
          <TextInput
            placeholder="Longitude"
            value={longitude}
            style={styles.textInput}
            onChangeText={(value) => setLongitude(value)}
          />
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
    height: 250,
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
    marginBottom: 8,
  },
});

export default AddPlaceModal;
