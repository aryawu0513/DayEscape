import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapWithRoute from "../Components/MapWithRoute";
import AddNameModal from "../Modals/AddNameModal";

const SaveRouteScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [savedRoute, setSavedRoute] = useState(route);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveRoute = (routeName) => {
    // call helper function to save the route with the provided routeName
    const updatedRoute = updateRouteName(route, routeName);
    console.log("Saving route:", updatedRoute);
    setSavedRoute(updatedRoute);
    closeModal();
  };

  const deleteRoute = () => {
    // Implement the logic to delete the route
    console.log("Deleting route:", routeName);
    closeModal();
  };

  // Example of a generic function to update the route name
  function updateRouteName(route, routeName) {
    return {
      ...route,
      routeName: routeName,
    };
  }

  return (
    <View style={styles.container}>
      <Text>This is the SaveRouteScreen!</Text>
      <Text>{savedRoute.routeName}</Text>
      <MapWithRoute route={route} />

      {/* Save Route Button */}
      <Button title="Save Route" onPress={openModal} />

      {/* AddNameModal */}
      <AddNameModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={(name) => {
          saveRoute(name);
        }}
        route={route}
      />
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
    flex: 2,
    width: "100%",
    height: "100%",
  },
});

export default SaveRouteScreen;
