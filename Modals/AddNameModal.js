import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet } from "react-native";

const AddNameModal = ({ visible, onClose, onSave, route }) => {
  const [routeName, setRouteName] = useState("");

  const createRoute = () => {
    onSave(routeName);
    setRouteName("");
  };

  const isCreateButtonDisabled = routeName.trim() === "";

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRouteName(text)}
            value={routeName}
            placeholder="Enter Route Name"
          />
          <Text style={styles.routeText}>{JSON.stringify(route)}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Create"
              onPress={createRoute}
              disabled={isCreateButtonDisabled}
            />
            <Button title="Delete" onPress={onClose} />
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
    padding: 20,
    borderRadius: 5,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
    paddingLeft: 10,
  },
  routeText: {
    fontSize: 10,
    color: "black",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default AddNameModal;
