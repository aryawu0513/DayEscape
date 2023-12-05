import { useState, useContext, useEffect} from "react";
import StateContext from "../Components/StateContext";

import {
  Text,
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";

import { locations } from "../FakeData/fake_locations";
import AddPlaceModal from "../Modals/AddPlaceModal";

import { // for Firestore access
  collection, doc, addDoc, setDoc,
  query, where, getDocs
} from "firebase/firestore";


function PlacesScreen(navigationProps) {
  const [modal, setModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const { firebaseProps, placeProps} = useContext(StateContext);
  const { place, setPlace} = placeProps;

  useEffect(() => {
    // Call the function when the component mounts
    getPlaces();
  }, [modal]);

  async function getPlaces() {
    const q = collection(firebaseProps.db, 'places');
    try {
      // Get all documents from the "places" collection
      const querySnapshot = await getDocs(q);
  
      // Extract the data from each document
      const placesData = querySnapshot.docs.map((doc) => doc.data());
      setPlaces(placesData);
    } catch (error) {
      console.error('Error getting places:', error.message);
      throw error;
    }
  }

  function pressedListItem (place) {
    setPlace(place);
    navigationProps.navigation.navigate("SingleNoteScreen")
  }

  const ListItem = (locationProps) => {
    return (
      <TouchableOpacity onPress = {() =>{pressedListItem(locationProps.place)}}>
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
          mode="contained"
          title="Add New Place"
          onPress={() => setModal(true)}
        ></Button>
        {modal && <AddPlaceModal onClose={setModal}></AddPlaceModal>}
      </View>
      <FlatList
        data={places}
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
    fontSize: 20,
  },
  listItem: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#b3e0f5",
  },
  listItemText: {
    fontSize: 12,
    marginTop: 5,
    paddingTop: 5,
    width: "100%",
    color: "grey",
  },
  listItemTitle: {
    fontSize: 15,
    marginTop: 10,
    paddingTop: 10,
    width: "80%",
  },
});

export default PlacesScreen;
