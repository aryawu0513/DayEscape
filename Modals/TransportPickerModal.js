import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Button,
  Dimensions,
} from "react-native";
import { fetchDirections } from "../utils";
import DropDownPicker from "react-native-dropdown-picker";

const { width } = Dimensions.get("window");

function TransportPickerModal({ onClose, onSave, selected }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Walking", value: "walking" },
    { label: "Driving", value: "driving" },
    { label: "Bicycling", value: "bicycling" },
    { label: "Transit", value: "transit" },
  ]);

  function closeModal() {
    onClose(false);
    onSave((prevTrip) => {
      const updatedPlaces = [...prevTrip.places];
      updatedPlaces[selected] = {
        ...updatedPlaces[selected],
        transportationMode: value,
      };
      console.log("setting mode for", updatedPlaces[selected], value);
      return {
        ...prevTrip,
        places: updatedPlaces,
      };
    });
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
          <Text>Choose a mode of transportation</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          <Button
            mode="contained"
            labelStyle={styles.buttonText}
            title="Save"
            onPress={() => {
              closeModal();
            }}
          ></Button>
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
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
});

export default TransportPickerModal;
