import React, { useState, useEffect, useContext} from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import StateContext from "../Components/StateContext";
import PersistentNote from "../Components/PersistentNote";

import { // for Firestore access
  collection, doc, addDoc, setDoc,
  query, updateDoc, getDoc
} from "firebase/firestore";

import { fakeNote } from "../FakeData/fake_note";

function SingleNoteScreen(props){
  const { firebaseProps } = useContext(StateContext);
  const { placeProps } = useContext(StateContext);
  const [current, setCurrent] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{placeProps.place.name}</Text>
      </View>
      <PersistentNote></PersistentNote>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  textContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 15,
    lineHeight: 24,
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
