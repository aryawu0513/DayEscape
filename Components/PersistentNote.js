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

function PersistentNote(props) {
  const { firebaseProps } = useContext(StateContext);
  const { placeProps } = useContext(StateContext);
  const [note, setNote] = useState(null);
  const [value, onChangeText] = useState("");

  async function updateNoteDescription() {
    try {
      const docRef = doc(
        firebaseProps.db,
        "persistent_notes",
        placeProps.place.id
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
    const q = doc(firebaseProps.db, "persistent_notes", placeProps.place.id);

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
          mode="contained"
          labelStyle={styles.buttonText}
          title="Save Note"
          onPress={updateNoteDescription}
        ></Button>
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

export default PersistentNote;
