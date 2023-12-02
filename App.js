import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import CreateRouteScreen from "./CreateScreen";
import CheckRouteScreen from "./CheckRouteScreen";

const App = () => {
  return (
    <View style={styles.container}>
      <CreateRouteScreen></CreateRouteScreen>
      {/* <CheckRouteScreen></CheckRouteScreen> */}
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
