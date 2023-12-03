import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { fakeRouteNoTransportation } from "../fake_route_no_transportation";
import TransportPickerModal from "../Modals/TransportPickerModal";

const TransportationScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [route, setRoute] = useState(fakeRouteNoTransportation);

  const orderedPlaces = route.places
    .slice()
    .sort((a, b) => new Date(a.arriveTime) - new Date(b.arriveTime));

  function setModal(index) {
    setModalVisible(true);
    setSelectedIndex(index);
  }

  const canContinue = orderedPlaces.every(
    (orderedPlaces) => orderedPlaces.transportationMode !== null
  );

  return (
    <View style={styles.container}>
      <View style={styles.informationContainer}>
        <Text>
          Click on the gray line to select your mode of transportation between
          each pair of points
        </Text>
        <View>
          {orderedPlaces.map((place, index) => (
            <View key={index}>
              <Text>{place.name}</Text>
              <Text>{`Transportation mode: ${
                place.transportationMode ? place.transportationMode : "missing"
              }`}</Text>
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          labelStyle={styles.buttonText}
          title="Finished!"
          disabled={canContinue}
        ></Button>
        {modalVisible && (
          <TransportPickerModal
            onClose={setModalVisible}
            selected={selectedIndex}
            onSave={setRoute}
          />
        )}
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
        {orderedPlaces.map((place, index) => (
          <Marker
            key={index}
            coordinate={place.coordinates}
            title={place.name}
          />
        ))}
        {orderedPlaces.map((place, index) => {
          const nextPlace = orderedPlaces[index + 1];
          if (nextPlace) {
            return (
              <Polyline
                key={`${place.name}-${nextPlace.name}`}
                coordinates={[
                  {
                    latitude: place.coordinates.latitude,
                    longitude: place.coordinates.longitude,
                  },
                  {
                    latitude: nextPlace.coordinates.latitude,
                    longitude: nextPlace.coordinates.longitude,
                  },
                ]}
                strokeWidth={5}
                strokeColor={place.transportationMode == null ? "grey" : "blue"}
                tappable={true}
                onPress={() => setModal(index)}
              />
            );
          }
          return null;
        })}
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

export default TransportationScreen;
