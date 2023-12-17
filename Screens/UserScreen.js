import React, { useContext } from "react";

import { View, Text, StyleSheet } from "react-native";
import StateContext from "../Components/StateContext";
import { Button } from "react-native-paper";

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
      <Text style={styles.text}>Enjoy your DayEscape!</Text>
      <Button style={styles.button} mode="contained" buttonColor={"#215ED5"} onPress={handleLogout}>Log out</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  button: {
    borderRadius: 14,
  }
});

export default UserScreen;
