function DisplayNote({ note }) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>Note for {note.place}</Text>
        <Text style={styles.textContainer}>{note.note_description}</Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
