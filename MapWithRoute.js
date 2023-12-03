import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const MapWithRoute = ({ route }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [places, setPlaces] = useState([]);
  const [transportation, setTransportation] = useState([]);

  useEffect(() => {
    // Update state with route data when the component mounts
    if (route) {
      const routeWaypoints = route.places.map((place) => place.coordinates);
      setWaypoints(routeWaypoints);
      setPlaces(route.places.map((place) => place.name));
      setTransportation(
        route.places.map((place) =>
          place.transportationMode ? place.transportationMode.toUpperCase() : ""
        )
      );
    }
  }, [route]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.34,
          longitude: -71.09,
          latitudeDelta: 0.1,
          longitudeDelta: 0.02,
        }}
      >
        {/* Render individual MapViewDirections for each consecutive pair of waypoints */}
        {waypoints.map((waypoint, index) => {
          const nextWaypoint = waypoints[index + 1];

          return (
            <React.Fragment key={`directions_${index}`}>
              <MapViewDirections
                origin={waypoint}
                destination={nextWaypoint}
                apikey="AIzaSyD2K1NnQskqsq17udp2vqYQF_We9kuvf6I"
                strokeWidth={4}
                strokeColor="red"
                mode={transportation[index]}
              />
              <Marker coordinate={waypoint} title={places[index]} />
            </React.Fragment>
          );
        })}
      </MapView>

      {/* Display the result information for each segment */}
      <View style={styles.resultContainer}>
        {route.places.map((place, index) => (
          <View key={`result_${index}`} style={styles.segmentInfo}>
            <Text>Segment {index + 1}</Text>
            <Text>Duration: {place.transportDuration} min</Text>
          </View>
        ))}
      </View>
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
  resultContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  segmentInfo: {
    marginBottom: 10,
  },
});

export default MapWithRoute;
