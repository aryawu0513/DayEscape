import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";

import { fakeNote } from "../fake_note";

function SingleNoteScreen() {
  const [note, setNote] = useState(fakeNote[0]);
  const [value, onChangeText] = useState(fakeNote[0].note_description);

  const handleSaveNote = () => {
    setNote((prevNote) => {
        return {...prevNote, note_description: value}
    })
    console.log(note);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text>Trader Joe's</Text>
        <TextInput
          editable
          multiline
          onChangeText={(text) => onChangeText((prev)=>{return text})}
          value={value}
          style={{ padding: 10 }}
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
    borderColor: 'blue',
  },
});

export default SingleNoteScreen;
