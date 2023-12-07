import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";
import StateContext from "../Components/StateContext";

import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

function PastNote() {
  const { firebaseProps } = useContext(StateContext);
  const { noteProps } = useContext(StateContext);
  const [notes, setNotes] = useState([]);
  const selectedPlace = noteProps.selectedPlace;

  console.log("Displaying past notes for", selectedPlace.name);

  const NoteItem = (note, trip) => {
    return (
      <View key={trip.createTime} style={styles.noteContainer}>
        <Text style={styles.titleText}>#{trip.tripName}</Text>
        <Text style={styles.textContainer}>{note.note_description}</Text>
      </View>
    );
  };

  async function getNotes() {
    let relatedNoteArray = [];
    try {
      await Promise.all(
        selectedPlace.routes.map(async (tripID) => {
          console.log("Getting trip ", tripID, "from firebase");
          const trip_doc = doc(firebaseProps.db, "trips", tripID);

          const querySnapshot_trip = await getDoc(trip_doc);
          const tripData = querySnapshot_trip.data();

          const relatedNote = tripData.notes.find(
            (note) => note.id === selectedPlace.id
          );
          relatedNoteArray.push({ relatedNote: relatedNote, trip: tripData });
        })
      );
    } catch (error) {
      console.error("Error fetching notes for this place:", error.message);
      throw error;
    }
    console.log("Found all related notes", relatedNoteArray);
    return relatedNoteArray;
  }

  useEffect(() => {
    async function fetchData() {
      const related = await getNotes();
      setNotes(related);
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Past Notes</Text>
      {notes && notes.map((note) => NoteItem(note.relatedNote, note.trip))}
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
  noteContainer: {
    backgroundColor: "white",
    padding: 15,
    flex: 1,
    width: "95%",
    height: "100%",
    borderRadius: 20,
    margin: 10,
  },
  textContainer: {
    width: "100%",
    lineHeight: 24,
    padding: 15,
    color: "#444444",
  },
  titleText: {
    fontSize: 20,
    padding: 15,
  },
});

export default PastNote;
