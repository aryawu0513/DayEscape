import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import StateContext from "../Components/StateContext";
import { collection, getDocs } from "firebase/firestore";

function TripsScreen({ props }) {
  const [trips, setTrips] = useState([]);
  const { firebaseProps } = useContext(StateContext);

  useEffect(() => {
    // Call the function when the component mounts
    getTrips();
  }, []);

  async function getTrips() {
    console.log("Getting Trips");
    const q = collection(firebaseProps.db, "trips");
    try {
      // Get all documents from the "routes" collection
      const querySnapshot = await getDocs(q);

      // Extract the data from each document
      const tripsData = querySnapshot.docs.map((doc) => doc.data());
      setTrips(tripsData);
      console.log("Setted trip with", tripsData);
    } catch (error) {
      console.error("Error getting routes:", error.message);
      throw error;
    }
  }

  function pressedListItem(trip) {
    console.log("NEED TO NAVIGATE TO ", trip);
    //props.navigation.navigate("TripInfoScreen", { trip });
  }

  const ListItem = ({ trip }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          pressedListItem(trip);
        }}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{trip.tripName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Your Trips</Text>
      </View>

      <FlatList
        data={trips}
        renderItem={({ item, index }) => {
          return <ListItem trip={item}></ListItem>;
        }}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    padding: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
  },
  listItem: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#b3e0f5",
  },
  listItemTitle: {
    fontSize: 15,
    marginTop: 10,
    paddingTop: 10,
    width: "80%",
  },
});

export default TripsScreen;
