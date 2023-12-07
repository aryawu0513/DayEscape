import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const MapWithTrip = ({ trip }) => {
  console.log("MapWithTrip is rendering.");

  return (
    <View style={styles.container}>
      {/* Display the result information for each segment */}
      <View style={styles.resultContainer}>
        {trip.places.slice(0, -1).map((place, index) => (
          <View key={`result_${index}`} style={styles.segmentInfo}>
            <Text>{place.name}</Text>
            <Text>
              By {place.transportationMode}: {place.transportDuration} min
            </Text>
          </View>
        ))}
        <Text>{trip.places.slice(-1)[0].name}</Text>
      </View>
      <View style={styles.mapContainer}>
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
          {trip.places.map((place, index) => {
            const waypoint = place.coordinates;
            const nextPlace = trip.places[index + 1];
            const nextWaypoint = nextPlace ? nextPlace.coordinates : null;

            return (
              <React.Fragment key={`directions_${index}`}>
                {nextWaypoint && (
                  <MapViewDirections
                    origin={waypoint}
                    destination={nextWaypoint}
                    apikey="AIzaSyD2K1NnQskqsq17udp2vqYQF_We9kuvf6I"
                    strokeWidth={4}
                    strokeColor="red"
                    mode={place.transportationMode.toUpperCase()}
                  />
                )}
                <Marker coordinate={waypoint} title={place.name} />
              </React.Fragment>
            );
          })}
        </MapView>
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
    padding: 20,
    ...StyleSheet.absoluteFillObject,
    // alignSelf: "center", // Align the map in the center horizontally
    // justifyContent: "center", // Align the map in the center vertically
  },
  mapContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    width: "100%",
    height: "100%",
  },
  resultContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    margin: 10,
    width: "100%",
  },
  segmentInfo: {
    marginBottom: 10,
  },
});

export default MapWithTrip;
