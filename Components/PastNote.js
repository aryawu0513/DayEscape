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

  const NoteItem = (note) => {
    return (
        <Text key={note.id} style={styles.textContainer}>{note.note_description}</Text>
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
          relatedNoteArray.push(relatedNote);
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
    <SafeAreaView>
      <Text style={styles.titleText}>Past Notes</Text>
      {notes && notes.map((note) => NoteItem(note))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    width: "100%",
    alignItems: "left",
    marginBottom: 10, // Add some margin to separate notes
  },
  textContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  titleText: {
    fontSize: 15,
    padding: 15,
  },
});

export default PastNote;
