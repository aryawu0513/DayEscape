import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// Sample data
import { fakeNote } from './fake_note';

const NoteScreen = ({ route }) => {
  const { place, routeInfo } = route.params; 

  const [currentNote, setCurrentNote] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    if (place) {
      const filteredNotes = fakeNote.filter((note) => note.place === place);
      setAllNotes(filteredNotes);
    } else if (routeInfo) {
      const placesInRoute = routeInfo.places;
      const filteredNotes = fakeNote.filter((note) => placesInRoute.includes(note.place));
      setAllNotes(filteredNotes);
      setWaypoints(routeInfo.places.map((place) => place.coordinates));
    }
  }, [place, routeInfo]);

  // Function to update the current note
  const handleNoteChange = (text) => {
    setCurrentNote(text);
  };

  // Function to save the current note to the list of all notes
  const handleSaveNote = () => {
    setAllNotes((prevNotes) => [
      ...prevNotes,
      { place, related_route: routeInfo ? routeInfo.routeId : null, note_description: currentNote },
    ]);

    setCurrentNote('');
  };
//need to modify later
  return (
    <View style={styles.container}>
      {/* Display the map with the route if routeInfo is available */}
      {routeInfo && (
        <MapView style={styles.map} initialRegion={/* Set the appropriate initial region */}>
          {waypoints.map((waypoint, index) => (
            <Marker key={`marker_${index}`} coordinate={waypoint} title={routeInfo.places[index].name} />
          ))}
          {/* Render MapViewDirections for each consecutive pair of waypoints */}
          {waypoints.map((waypoint, index) => {
            const nextWaypoint = waypoints[index + 1];
            return (
              nextWaypoint && (
                <MapViewDirections
                  key={`directions_${index}`}
                  origin={waypoint}
                  destination={nextWaypoint}
                  apikey="AIzaSyD2K1NnQskqsq17udp2vqYQF_We9kuvf6I"
                  strokeWidth={4}
                  strokeColor="red"
                />
              )
            );
          })}
        </MapView>
      )}

      {/* Display the notes section */}
      <View style={styles.notesContainer}>
        <Text style={styles.title}>{place || 'All Places in Route'}</Text>

        {/* Input for the current note */}
        <TextInput
          style={styles.input}
          placeholder="Write your note..."
          multiline
          value={currentNote}
          onChangeText={handleNoteChange}
        />

        {/* Button to save the current note */}
        <TouchableOpacity style={styles.button} onPress={handleSaveNote}>
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>

        {/* List of all notes */}
        <FlatList
          data={allNotes}
          keyExtractor={(item, index) => `${item.place}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <Text>{item.note_description}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
    height: 300,
  },
  notesContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noteContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
});

export default NoteScreen;
