// ErrorModal.js
import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

const TimeErrorModal = ({ visible, onClose, message }) => {

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.errorModal}>
          <Text>{message}</Text>
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

export default TimeErrorModal;
