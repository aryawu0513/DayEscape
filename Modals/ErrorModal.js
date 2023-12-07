// ErrorModal.js
import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

const ErrorModal = ({ visible, onClose, result }) => {
  //console.log("ErrorModal - result:", result);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.errorModal}>
          <Text>This trip is not feasible!</Text>
          <Text>{`Failed at place: ${result.failedPlace}`}</Text>
          <Text>{`Late by: ${result.lateTime} minutes`}</Text>
          <Button title="OK" onPress={onClose} />
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
  errorModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    elevation: 5,
  },
});

export default ErrorModal;
