import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const App = () => {
  const [destination, setDestination] = useState({
    latitude: 6.5792,
    longitude: 79.9629,
  });

  const [origin, setOrigin] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
  });

  const [waypoints, setWaypoints] = useState([
    { latitude: 6.9001, longitude: 79.9001 },
    { latitude: 6.821, longitude: 79.8886 },
    // Add more waypoints as needed
    // { latitude: ..., longitude: ... },
    // { latitude: ..., longitude: ... },
  ]);

  const [resultInfo, setResultInfo] = useState({
    distance: 0,
    duration: 0,
  });

  const handleDirectionsReady = (result) => {
    console.log(`Distance: ${result.distance} km`);
    console.log(`Duration: ${result.duration} min.`);
    console.log(`Coordinates: ${result.coordinates}`);
    // Set the result information in the state
    setResultInfo({
      distance: result.distance,
      duration: result.duration,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 5,
          longitudeDelta: 1,
        }}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          apikey="AIzaSyD2K1NnQskqsq17udp2vqYQF_We9kuvf6I"
          strokeWidth={4}
          strokeColor="red"
          mode={"DRIVING"}
          onReady={handleDirectionsReady}
        />
        <Marker coordinate={origin} title="Starting Point" />
        <Marker coordinate={destination} title="Destination Point" />
      </MapView>

      {/* Display the result information */}
      <View style={styles.resultContainer}>
        <Text>Distance: {resultInfo.distance} km</Text>
        <Text>Duration: {resultInfo.duration} min</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});

export default App;
