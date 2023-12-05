import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

function TimePickerModal({ onClose, pin, onCreate, trip, existingPlace }) {
  //const [arrivalTime, setArrivalTime] = useState(new Date(1598051730000));
  //const [leaveTime, setLeaveTime] = useState(new Date(1598051730000));

  const [arrivalTime, setArrivalTime] = useState(
    existingPlace ? new Date(existingPlace.arrivalTime) : new Date()
  );
  const [leaveTime, setLeaveTime] = useState(
    existingPlace ? new Date(existingPlace.leaveTime) : new Date()
  );

  const changeArrivalTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setArrivalTime(currentDate);
  };
  const changeLeaveTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setLeaveTime(currentDate);
  };

  function handleAddToTrip() {
    if (leaveTime.getTime() <= arrivalTime.getTime()) {
      // Handle invalid case (e.g., show an error message)
      console.error(
        "Invalid time selection: Leave time must be before arrival time",
        leaveTime.getTime(),
        arrivalTime.getTime()
      );
      return;
    }
    const isOverlap = trip.places.some((place) => {
      if (existingPlace && existingPlace.name === place.name) {
        return false;
      }
      const existingArrivalTime = new Date(place.arrivalTime);
      const existingLeaveTime = new Date(place.leaveTime);

      return (
        (arrivalTime >= existingArrivalTime &&
          arrivalTime <= existingLeaveTime) ||
        (leaveTime >= existingArrivalTime && leaveTime <= existingLeaveTime) ||
        (arrivalTime <= existingArrivalTime && leaveTime >= existingLeaveTime)
      );
    });
    if (isOverlap) {
      // Handle overlapping case (e.g., show a warning)
      console.error(
        "Warning: Overlapping time constraints with existing places"
      );
      return;
    }
    if (existingPlace) {
      console.log(
        "modify the time constraint of an existing place in the trip"
      );
      const index = trip.places.findIndex(
        (place) => place.name === existingPlace.name
      );

      if (index !== -1) {
        // Update the existing place directly in the list
        trip.places[index].arrivalTime = arrivalTime;
        trip.places[index].leaveTime = leaveTime;
      }
      onCreate({ ...trip });
    } else {
      console.log("a new place added into the trip");
      let newPlace = {
        name: pin.name,
        coordinates: pin.coordinates,
        arrivalTime: arrivalTime,
        leaveTime: leaveTime,
        transportationMode: null,
        transportDuration: null,
      };
      onCreate((prevTrip) => {
        const updatedPlaces = [...prevTrip.places, newPlace];
        return {
          ...prevTrip,
          places: updatedPlaces,
        };
      });
    }
    onClose(false);
  }
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
          <Button onPress={handleAddToTrip} title="Add to Trip" />
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
    paddingTop: 20,
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default TimePickerModal;
