import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
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

function TripNote(props) {
  const { tripProps, firebaseProps } = useContext(StateContext);
  const { trip, setTrip } = tripProps;
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
      const updatedTrip = { ...trip, notes: newNotes };

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
            <React.Fragment key={note.id}>
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
                mode="contained"
                labelStyle={styles.buttonText}
                title="Save Note"
                onPress={() => updateNoteDescription(note)}
              ></Button>
            </React.Fragment>
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
    height: "100%",
    alignItems: "center",
  },
  textContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 15,
    lineHeight: 24,
  },
  titleText: {
    fontSize: 15,
    padding: 15,
  },
});

export default TripNote;
