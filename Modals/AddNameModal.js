import React, { useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

const AddNameModal = ({ visible, onDelete, onSave, trip }) => {
  const [tripName, setTripName] = useState("");

  const createTrip = () => {
    onSave(tripName);
    setTripName("");
  };

  const isCreateButtonDisabled = tripName.trim() === "";

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            mode="flat"
            activeUnderlineColor="#215ED5"
            underlineColor="#7F9AD0"
            style={styles.input}
            onChangeText={(text) => setTripName(text)}
            value={tripName}
            placeholder="Enter Trip Name"
          />
          <Text style={styles.tripText}>{JSON.stringify(trip)}</Text>
          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={onDelete} textColor={"#215ED5"}>
              Delete
            </Button>
            <Button
              mode="text"
              onPress={createTrip}
              disabled={isCreateButtonDisabled}
              textColor={"#215ED5"}
            >
              Create
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%", // Adjust the width as needed
    backgroundColor: "white",
    padding: 30,
    borderRadius: 5,
    elevation: 5,
  },
  input: {
    height: 40,
    width: "100%",
    paddingLeft: 10,
    backgroundColor: "#F5F5F5",
  },
  tripText: {
    fontSize: 10,
    color: "black",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default AddNameModal;
