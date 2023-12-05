import React, { useState, useContext} from "react";
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

import { // for Firestore access
  collection, doc, addDoc, setDoc,
  query, where, getDocs
} from "firebase/firestore";

import { fakeNote } from "../FakeData/fake_note";

function SingleNoteScreen(props){
  const { firebaseProps } = useContext(StateContext);
  console.log(firebaseProps);
  const [note, setNote] = useState(fakeNote[0]);
  const [value, onChangeText] = useState(fakeNote[0].note_description);

  const handleSaveNote = () => {
    setNote((prevNote) => {
      return { ...prevNote, note_description: value };
    });
    console.log(note);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Trader Joe's</Text>
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
          onPress={handleSaveNote}
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
    fontSize: 20,
    padding: 15,
  },
});

export default SingleNoteScreen;
