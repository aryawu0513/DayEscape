import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { locations } from "./fake_locations";
import TimePickerModal from "./TimePickerModal";

const emptyRoute = {
  routeName: null,
  createTime: null,
  places: [],
};

const CreateRouteScreen = () => {
  const [selectedPin, setSelectedPin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [route, setRoute] = useState(emptyRoute);

  function setModal(location) {
    setSelectedPin(location);
    setModalVisible(true);
  }

  const sortedPlaces = route.places.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);

  return (
    <View style={styles.container}>
      <View style={styles.informationContainer}>
        <Text>Create New Route</Text>
        {modalVisible && (
          <TimePickerModal onCreate={setRoute} pin={selectedPin} onClose={setModalVisible}></TimePickerModal>
        )}
        {sortedPlaces.map((place, index) => (
        <Text key={index}>{index+1}: {place.name}</Text>
      ))}
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.34,
          longitude: -71.09,
          latitudeDelta: 0.1,
          longitudeDelta: 0.02,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.coordinates}
            title={location.name}
            onPress={e=>setModal(location)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 2,
    width: "100%",
    height: "100%",
  },
  informationContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});

export default CreateRouteScreen;
