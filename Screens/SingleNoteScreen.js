import React, { useState, useEffect, useContext} from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import StateContext from "../Components/StateContext";
import PersistentNote from "../Components/PersistentNote";
import PastNote from "../Components/PastNote";

import { // for Firestore access
  collection, doc, addDoc, setDoc,
  query, updateDoc, getDoc
} from "firebase/firestore";


function SingleNoteScreen(props) {
  const { firebaseProps } = useContext(StateContext);
  const { noteProps } = useContext(StateContext);

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.titleContainer}>
        <Text style={styles.titleText}>{noteProps.selectedPlace.name}</Text>
      </SafeAreaView>
      <PersistentNote></PersistentNote>
      <PastNote></PastNote>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start", // Change "left" to "flex-start"
  },
  titleContainer: {
    padding: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    padding: 15,
  },
});

export default SingleNoteScreen;
