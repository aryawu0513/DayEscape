import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import StateContext from "../Components/StateContext";

import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

function TripNote(props) {
  const { selectedTripProps, firebaseProps } = useContext(StateContext);
  const { selectedTrip, setSelectedTrip } = selectedTripProps;
  const { db } = firebaseProps;
  const { placeProps } = useContext(StateContext);
  const [notes, setNotes] = useState(null);
  const [noteValues, setNoteValues] = useState({}); // State for individual note values
  const { tripId } = props;

  async function updateNoteDescription(selectedNote) {
    try {
      const docRef = doc(db, "trips", tripId);

      // Assuming 'notes' is the field containing the array of notes in your trip object
      const newNotes = notes.map((note) => {
        if (note.id === selectedNote.id) {
          return { ...note, note_description: noteValues[note.id] || "" }; // Update with the new description
        }
        return note;
      });

      // Update the 'notes' field in the trip object
      const updatedTrip = { ...selectedTrip, notes: newNotes };
      console.log("OMGOMG", updatedTrip.tripName);

      await updateDoc(docRef, updatedTrip);

      // After updating, you might want to fetch the updated data again
      getNote();
    } catch (error) {
      console.error("Error updating note description:", error.message);
    }
  }

  useEffect(() => {
    getNote();
  }, []);

  async function getNote() {
    try {
      const q = doc(db, "trips", tripId);
      const querySnapshot = await getDoc(q);
      const noteData = querySnapshot.data();
      //console.log("noteData", noteData.notes);
      setNotes(noteData.notes);

      // Initialize noteValues state based on existing notes
      const initialNoteValues = {};
      noteData.notes.forEach((note) => {
        initialNoteValues[note.id] = note.note_description || "";
      });
      setNoteValues(initialNoteValues);
    } catch (error) {
      console.error("Error getting note:", error.message);
      throw error;
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        {notes !== null ? (
          notes.map((note) => (
            <View key={note.id} style={styles.noteContainer}>
              <Text style={styles.titleText}>
                Current Note for {note.place}
              </Text>
              <TextInput
                editable
                multiline
                onChangeText={(text) =>
                  setNoteValues((prev) => ({
                    ...prev,
                    [note.id]: text,
                  }))
                }
                value={noteValues[note.id] || ""}
                style={styles.textContainer}
              />
              <Button
                mode="text"
                title="Save Note"
                textColor={"#215ED5"}
                onPress={() => updateNoteDescription(note)}
              >
                Save Note
              </Button>
            </View>
          ))
        ) : (
          <Text>Loading notes...</Text>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  noteContainer: {
    paddingBottom: 10,
  },
  textContainer: {
    backgroundColor: "white",
    padding: 30,
    paddingTop: 20,
    flex: 1,
    minHeight: 100,
    width: "90%",
    height: "100%",
    borderRadius: 20,
    lineHeight: 24,
    color: "#444444",
    left: '5%',
  },
  titleText: {
    fontSize: 14,
    padding: 15,
    left: '5%',
  },
});

export default TripNote;
