import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Button,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");

function TimePickerModal({onClose, pin, onCreate}) {
  const [arrivalTime, setArrivalTime] = useState(new Date(1598051730000));
  const [leaveTime, setLeaveTime] = useState(new Date(1598051730000));

  const changeArrivalTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setArrivalTime(currentDate);
  };
  const changeLeaveTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setLeaveTime(currentDate);
  };

  function handleAddToRoute() {
    let newPlace = {
        name: pin.name,
        coordinates: pin.coordinates,
        arrivalTime: arrivalTime,
        leaveTime: leaveTime,
        transportationMode: null,
        transportDuration: null,
    };
    onCreate((prevRoute) => {
        const updatedPlaces = [...prevRoute.places, newPlace];
        return {
            ...prevRoute,
            places: updatedPlaces,
          };
        }
    );
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
          <Text>Select arrival time: {arrivalTime.toLocaleString()}</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={arrivalTime}
              mode={"time"}
              is24Hour={true}
              onChange={changeArrivalTime}
            />
        <Text>Select leave time: {leaveTime.toLocaleString()}</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={leaveTime}
              mode={"time"}
              is24Hour={true}
              onChange={changeLeaveTime}
            />
        <Button onPress={handleAddToRoute} title="Add to Route"/>
        </View>
      </View>
    </Modal>
  );
};

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

export default TimePickerModal;
