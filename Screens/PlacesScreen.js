import {
  Text,
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";

import { locations } from "../fake_locations";
import AddPlaceModal from "../Modals/AddPlaceModal";
import { useState } from "react";

function PlacesScreen() {
  const [modal, setModal] = useState(false);
  const ListItem = (props) => {
    return (
      <TouchableOpacity>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Places You Saved</Text>
        <Button mode="contained" title="Add New Place" onPress={()=>setModal(true)}></Button>
        {modal && <AddPlaceModal onClose={setModal}></AddPlaceModal>}
      </View>
      <FlatList
        data={locations}
        renderItem={({ item, index }) => {
          return (
            <ListItem text={item.name} id={index} location={item}></ListItem>
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
