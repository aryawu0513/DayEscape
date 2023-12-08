import React, { useContext, useState, useEffect } from "react";

import { View, Text, Button, StyleSheet } from "react-native";
import StateContext from "../Components/StateContext";

const UserScreen = (props) => {
  const { signedInProps, firebaseProps } = useContext(StateContext);
  const { auth } = firebaseProps;
  const { signOutUser } = signedInProps;

  const handleLogout = () => {
    signOutUser();

    // Navigate back to the LoginScreen
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Enjoy your DayEscape</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserScreen;
