import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
import TransportPickerModal from "../Modals/TransportPickerModal";
import { validTrip } from "../utils";
import ErrorModal from "../Modals/ErrorModal";
import { useNavigation } from "@react-navigation/native";
import StateContext from "../Components/StateContext";

const TransportationScreen = (props) => {
  const { tripProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [canContinue, setCanContinue] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  trip.places = trip.places
    .slice()
    .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

  // useEffect(() => {
  //   // Set testResult to null when the component mounts
  //   setTestResult(null);
  // }, []); // Empty dependency array ensures this effect runs only once on mount
  useFocusEffect(
    React.useCallback(() => {
      // Set testResult to null when the component gains focus
      setTestResult(null);
    }, [])
  );

  useEffect(() => {
    const canContinue = trip.places
      .slice(0, -1)
      .every((place) => place.transportationMode !== null);
    setCanContinue(canContinue);
  }, [trip]);

  const handleButtonClick = async () => {
    try {
      const result = await validTrip(trip);
      setTestResult((prevresult) => {
        return result;
      });
      setTrip(result.trip);
      if (!result.feasible) {
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function setModal(index) {
    setModalVisible(true);
    setSelectedIndex(index);
  }

  return (
    <View style={styles.container}>
      {testResult !== null && testResult.feasible
        ? props.navigation.navigate("SaveTripScreen") //<MapWithTrip trip={trip}
        : testResult !== null && (
            <ErrorModal
              visible={errorModalVisible}
              onClose={() => setErrorModalVisible(false)}
              result={testResult}
            />
          )}
      <View style={styles.informationContainer}>
        <Text style={styles.textalert}>
          Click on the gray line to select your mode of transportation between
          each pair of points!
        </Text>
        <View>
          {trip.places.map((place, index) => (
            <View key={index}>
              {/* <Text>{place.name}</Text> */}
              <Text style={styles.places} key={index}>
                {index + 1}: {place.name}
              </Text>
              {index != trip.places.length - 1 && (
                <Text
                  style={styles.transportationMode}
                >{`Transportation mode: ${
                  place.transportationMode
                    ? place.transportationMode
                    : "missing"
                }`}</Text>
              )}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            disabled={!canContinue}
            title="Finished!"
            buttonColor={"#215ED5"}
            style={styles.button}
            onPress={handleButtonClick}
          >
            Finished!
          </Button>
        </View>
        {modalVisible && (
          <TransportPickerModal
            onClose={setModalVisible}
            selected={selectedIndex}
            onSave={setTrip}
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
        {trip.places.map((place, index) => (
          <Marker
            key={index}
            coordinate={place.coordinates}
            title={place.name}
            pinColor="#215ED5"
          />
        ))}
        {trip.places.map((place, index) => {
          const nextPlace = trip.places[index + 1];
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
                strokeColor={
                  place.transportationMode == null ? "grey" : "#FF7A00"
                }
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
    marginTop: 20,
    margin: 5,
  },
  informationContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "100%",
  },
  textalert: {
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
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
  buttonContainer: {
    marginTop: 15,
    alignItems: "center", // Align the button horizontally in the center
    justifyContent: "center", // Align the button vertically in the center
  },
  button: {
    width: "50%",
    borderRadius: 14,
  },
});

export default TransportationScreen;
