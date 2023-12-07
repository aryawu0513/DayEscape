import React, { useState, useEffect, useContext } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import StateContext from "../Components/StateContext";
import PersistentNote from "../Components/PersistentNote";
import PastNote from "../Components/PastNote";

import {
  // for Firestore access
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  updateDoc,
  getDoc,
} from "firebase/firestore";

function SingleNoteScreen(props) {
  const { firebaseProps } = useContext(StateContext);
  const { noteProps } = useContext(StateContext);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{noteProps.selectedPlace.name}</Text>
      </View>
      <PersistentNote></PersistentNote>
      <PastNote></PastNote>
    </ScrollView>
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
    padding: 15,
  },
});

export default SingleNoteScreen;
