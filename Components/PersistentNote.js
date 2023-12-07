import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from 'react-native-paper';
import StateContext from "../Components/StateContext";

import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

function PersistentNote(props) {
  const { firebaseProps } = useContext(StateContext);
  const { noteProps } = useContext(StateContext);
  const [note, setNote] = useState(null);
  const [value, onChangeText] = useState("");

  async function updateNoteDescription() {
    try {
      const docRef = doc(
        firebaseProps.db,
        "persistent_notes",
        noteProps.selectedPlace.id
      );

      // Assuming 'note_description' is the field you want to update
      const newData = {
        note_description: value, // Set your updated value here
      };

      await updateDoc(docRef, newData);

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
    const q = doc(
      firebaseProps.db,
      "persistent_notes",
      noteProps.selectedPlace.id
    );

    try {
      // Get the document from the "persistent_notes" collection where placeId matches
      const querySnapshot = await getDoc(q);
      const noteData = querySnapshot.data();
      setNote(noteData);
      onChangeText(noteData.note_description);
    } catch (error) {
      console.error("Error getting note:", error.message);
      throw error;
    }
  }

  console.log(note);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Current Note</Text>
        <TextInput
          editable
          multiline
          onChangeText={(text) =>
            onChangeText((prev) => {
              return text;
            })
          }
          value={value}
          style={styles.textContainer}
        />
        <Button
          mode="text"
          title="Save Note"
          textColor={"#215ED5"}
          onPress={updateNoteDescription}
        >Save Note</Button>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    bottom: 10,
  },
  textContainer: {
    backgroundColor: "white",
    padding: 30,
    paddingTop: 20,
    flex: 1,
    minHeight: 100,
    width: "95%",
    height: "100%",
    borderRadius: 20,
    lineHeight: 24,
    color: "#444444",
  },
  titleText: {
    fontSize: 20,
    padding: 15,
  },
});

export default PersistentNote;
