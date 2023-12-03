import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import CreateRouteScreen from "./Screens/CreateScreen";
import TransportationScreen from "./Screens/TransportationScreen";
import PlacesScreen from "./Screens/PlacesScreen";
import SingleNoteScreen from "./Screens/SingleNoteScreen";
import SaveRouteScreen from "./Screens/SaveRouteScreen";
import { fakeRoutes } from "./FakeData/fake_route";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // <View style={styles.container}>
    //   {/* <CreateRouteScreen></CreateRouteScreen> */}
    //   {/* <TransportationScreen></TransportationScreen> */}
    //   <SaveRouteScreen route={fakeRoutes[0]}></SaveRouteScreen>
    //   {/* <LocationScreen></LocationScreen> */}
    //   {/* <SingleNoteScreen></SingleNoteScreen> */}
    // </View>
    <NavigationContainer>
      {/* Define your navigation stack */}
      <Stack.Navigator>
        <Stack.Screen
          name="TransportationScreen"
          component={TransportationScreen}
        />
        {/* ... other screens ... */}
        <Stack.Screen name="SaveRouteScreen" component={SaveRouteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
