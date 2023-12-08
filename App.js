import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

import CreateTripScreen from "./Screens/CreateTripScreen.js";
import TransportationScreen from "./Screens/TransportationScreen";
import PlacesScreen from "./Screens/PlacesScreen";
import SingleNoteScreen from "./Screens/SingleNoteScreen";
import TripsScreen from "./Screens/TripsScreen.js";
import SaveTripScreen from "./Screens/SaveTripScreen";
import TripInfoScreen from "./Screens/TripInfoScreen";
import LoginScreen from "./Screens/LoginScreen";
import UserScreen from "./Screens/UserScreen.js";

import StateContext from "./Components/StateContext.js";
import { emptyTrip } from "./FakeData/empty_trip.js";
import { fakeTrips } from "./FakeData/fake_trip";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import {
  // access to Firestore features:
  getFirestore,
} from "firebase/firestore";
import {
  // access to authentication features:
  getAuth,
  // for logging out:
  signOut,
} from "firebase/auth";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CreateTripScreen" component={CreateTripScreen} />
    <Stack.Screen
      name="TransportationScreen"
      component={TransportationScreen}
    />
    {/* ... other screens ... */}
    <Stack.Screen name="SaveTripScreen" component={SaveTripScreen} />
  </Stack.Navigator>
);

const PlaceStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="PlacesScreen" component={PlacesScreen} />
    <Stack.Screen name="SingleNoteScreen" component={SingleNoteScreen} />
    {/* ... other screens ... */}
  </Stack.Navigator>
);

const TripStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TripsScreen" component={TripsScreen} />
    <Stack.Screen name="TripInfoScreen" component={TripInfoScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserScreen" component={UserScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [trip, setTrip] = useState(emptyTrip);
  const [selectedTrip, setSelectedTrip] = useState(emptyTrip);
  const [place, setPlace] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [listOfPlaces, setListOfPlaces] = useState(null);
  const [hasDelete, setHasDelete] = useState(null);
  const tripProps = { trip, setTrip };
  const selectedTripProps = {
    selectedTrip,
    setSelectedTrip,
    hasDelete,
    setHasDelete,
  };
  // "global" signed-in state for App shared by screens
  const [signedInUser, setSignedInUser] = useState(null);
  const signInUser = (username) => setSignedInUser(username);
  const signOutUser = () => setSignedInUser(null);
  const signedInProps = { signedInUser, signInUser, signOutUser };
  const firebaseProps = { db, auth };
  const placeProps = { place, setPlace, listOfPlaces, setListOfPlaces };
  const noteProps = { selectedPlace, setSelectedPlace };
  const auth = getAuth(firebaseApp);
  const screenProps = {
    tripProps,
    selectedTripProps,
    signedInProps,
    firebaseProps,
    placeProps,
    noteProps,
  };
  // The above is equivalent to:
  //console.log(trip);
  // Render LoginScreen if not signed in
  if (!signedInUser) {
    return (
      <LoginScreen
        auth={auth}
        signedInProps={signedInProps}
        signedInUser={signedInUser}
      />
    );
  }
  // Render main navigation if signed in
  return (
    <StateContext.Provider value={screenProps}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Places" component={PlaceStack} />
          <Tab.Screen name="Map" component={MapStack} />
          <Tab.Screen name="Trips" component={TripStack} />
          <Tab.Screen name="User" component={UserStack} />
          {/* Add more tabs as needed */}
        </Tab.Navigator>
      </NavigationContainer>
    </StateContext.Provider>
  );
}

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
