import React, { useState, useContext } from "react";
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
  const { firebaseProps } = useContext(StateContext);

  function closeModal() {
    addPlaceToDB();
    onClose(false);
  }

  async function addPlaceToDB() {
    const timestamp = new Date().getTime();
    const timestampString = timestamp.toString();

    // Add a new place in collection "places"
    return setDoc(doc(firebaseProps.db, "places", timestampString), {
      id: timestampString,
      name: name,
      coordinates: { longitude: longitude, latitude: latitude },
    });
  }

  async function addPlaceToDB() {
    try {
      const timestamp = new Date().getTime();
      const timestampString = timestamp.toString();

      // Add a new place in collection "places"
      await setDoc(doc(firebaseProps.db, "places", timestampString), {
        id: timestampString,
        name: name,
        coordinates: { longitude: longitude, latitude: latitude },
      });

      await setDoc(doc(firebaseProps.db, "persistent_notes", timestampString), {
        id: timestampString,
        place: name,
        note_description: "",
        related_trip: null,
      });
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
            value={longitude}
            style={styles.textInput}
            onChangeText={(value) => setLongitude(value)}
          />
          <TextInput
            placeholder="Longitude"
            value={latitude}
            style={styles.textInput}
            onChangeText={(value) => setLatitude(value)}
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
