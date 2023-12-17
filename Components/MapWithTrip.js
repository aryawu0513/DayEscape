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
            <Text style={styles.places}>{place.name}</Text>
            <Text style={styles.transportationMode}>
              By {place.transportationMode}: {Math.round(place.transportDuration * 100) / 100} min
            </Text>
          </View>
        ))}
        <Text style={styles.places}>{trip.places.slice(-1)[0].name}</Text>
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
                    strokeColor="#FF7A00"
                    mode={place.transportationMode.toUpperCase()}
                  />
                )}
                <Marker
                  coordinate={waypoint}
                  title={place.name}
                  pinColor="#215ED5"
                />
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
    // padding: 20,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 2,
    ...StyleSheet.absoluteFillObject,
    marginTop: 20,
    margin: 5,
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
    padding: 10,
    width: "100%",
  },
  places: {
    padding: 5,
    fontWeight: "500",
  },
  transportationMode: {
    paddingLeft: 30,
    padding: 5,
    color: "#215ED5",
    fontWeight: "500",
  },
});

export default MapWithTrip;
