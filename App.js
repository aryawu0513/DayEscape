import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MapWithRoute from "./MapWithRoute";
import { validRoute } from "./utils";
import { fakeRoutes } from "./fake_route";

const App = () => {
  const fakeRouteToTest = fakeRoutes[0];
  const [testResult, setTestResult] = useState(null);

  const handleButtonClick = async () => {
    try {
      const result = await validRoute(fakeRouteToTest);
      setTestResult(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Check Route" onPress={handleButtonClick} />
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
