import React, { useState } from "react";
import { StyleSheet} from "react-native";

import CreateTripScreen from "./Screens/CreateTripScreen.js";
import TransportationScreen from "./Screens/TransportationScreen";
import PlacesScreen from "./Screens/PlacesScreen";
import SingleNoteScreen from "./Screens/SingleNoteScreen";
import SaveTripScreen from "./Screens/SaveTripScreen";

import StateContext from "./Components/StateContext.js";
import { emptyTrip } from "./FakeData/empty_trip.js";
import { fakeTrips } from "./FakeData/fake_trip";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { // access to Firestore features:
  getFirestore, 
} from "firebase/firestore";


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
    <Stack.Screen name="NoteScreen" component={NoteScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [trip, setTrip] = useState(emptyTrip);
  const [place, setPlace] = useState(null);
  const [listOfPlaces, setListOfPlaces] = useState(null);
  const tripProps = { trip, setTrip };
  // "global" signed-in state for App shared by screens
  const [signedInUser, setSignedInUser] = useState(null);
  const signInUser = (username) => setSignedInUser(username);
  const signOutUser = () => setSignedInUser(null);
  const signedInProps = { signedInUser, signInUser, signOutUser };
  const firebaseProps = {db};
  const placeProps = {place, setPlace, listOfPlaces, setListOfPlaces};
  const screenProps = { tripProps, signedInProps , firebaseProps, placeProps};
  // The above is equivalent to:
  //console.log(trip);
  return (
    <StateContext.Provider value={screenProps}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Places" component={PlaceStack} />
          <Tab.Screen name="Map" component={MapStack} />
          <Tab.Screen name="Trips" component={TripStack} />
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
