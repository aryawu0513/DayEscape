import { useState, useContext, useEffect } from "react";
import StateContext from "../Components/StateContext";

import {
  Text,
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Button } from "react-native-paper";

import { locations } from "../FakeData/fake_locations";
import AddPlaceModal from "../Modals/AddPlaceModal";

import { collection, getDocs } from "firebase/firestore";

function PlacesScreen(navigationProps) {
  const [modal, setModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const {
    firebaseProps,
    placeProps,
    noteProps,
    selectedTripProps,
    signedInProps,
  } = useContext(StateContext);
  const { listOfPlaces, setListOfPlaces } = placeProps;
  const { selectedPlace, setSelectedPlace } = noteProps;
  const { hasDelete } = selectedTripProps;

  useEffect(() => {
    // Call the function when the component mounts
    getPlaces();
  }, [hasDelete]);

  async function getPlaces() {
    console.log("user id is", signedInProps.uid);
    const q = collection(firebaseProps.db, "users", signedInProps.uid, "places");
    try {
      // Get all documents from the "places" collection
      const querySnapshot = await getDocs(q);

      // Extract the data from each document
      const placesData = querySnapshot.docs.map((doc) => doc.data());
      setPlaces(placesData);
      setListOfPlaces(placesData);
    } catch (error) {
      console.error("Error getting places:", error.message);
      throw error;
    }
  }

  function pressedListItem(place) {
    setSelectedPlace(place);
    navigationProps.navigation.navigate("SingleNoteScreen");
  }

  const ListItem = (locationProps) => {
    return (
      <TouchableOpacity
        onPress={() => {
          pressedListItem(locationProps.place);
        }}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{locationProps.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Places You Saved</Text>
        <Button
          mode="text"
          // onPress={() => setModal(true)}
          onPress={() => navigationProps.navigation.navigate("AddPlaceScreen")}
          textColor={"#215ED5"}
        >
          Add New Place
        </Button>
        {modal && <AddPlaceModal onClose={setModal}></AddPlaceModal>}
      </View>
      <FlatList
        data={listOfPlaces}
        renderItem={({ item, index }) => {
          return (
            <ListItem text={item.name} id={item.id} place={item}></ListItem>
          );
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
    fontSize: 24,
    padding: 14,
  },
  listItem: {
    padding: 12,
    paddingBottom: 26,
    paddingLeft: 26,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
  },
  listItemText: {
    fontSize: 12,
    marginTop: 5,
    paddingTop: 5,
    width: "100%",
    color: "grey",
  },
  listItemTitle: {
    fontSize: 16,
    marginTop: 10,
    paddingTop: 10,
    width: "80%",
  },
});

export default PlacesScreen;
