import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import MapWithRoute from "./MapWithRoute";
import { validRoute } from "./utils";
import { fakeRoutes } from "./fake_route";

const App = () => {
  const fakeRouteToTest = fakeRoutes[0];
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Call the validRoute function with the fake route
    validRoute(fakeRouteToTest)
      .then((testResult) => {
        // Display the result in the console or use it as needed in your app
        setTestResult(testResult);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []); // Empty dependency array ensures this useEffect runs only once

  return (
    <View style={styles.container}>
      {testResult !== null && testResult.feasible ? (
        <MapWithRoute fakeRoute={fakeRouteToTest} />
      ) : (
        <Text>{`The route failed at ${
          testResult ? testResult.failedPlace : "unknown place"
        }! Late by ${
          testResult ? testResult.lateTime : "unknown time"
        } minutes.`}</Text>
      )}
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
    ...StyleSheet.absoluteFillObject,
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

export default App;
