import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import MapWithTrip from "../Components/MapWithTrip";
import StateContext from "../Components/StateContext";
import { emptyTrip } from "../FakeData/empty_trip";
import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import PersistentNote from "../Components/PersistentNote";
import TripNote from "../Components/TripNote";

import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TripInfoScreen = (props) => {
  const { selectedTripProps, firebaseProps } = useContext(StateContext);
  const {
    selectedTrip,
    setSelectedTrip,
    hasDelete,
    setHasDelete,
  } = selectedTripProps;
  const { db } = firebaseProps;
  const [images, setImages] = useState([]);

  // Assuming that route.params.tripId contains the ID of the selected trip
  const tripId = selectedTrip.createTime;

  useEffect(() => {
    getTrip();
  }, []);

  // Find the selected trip based on tripId
  async function getTrip() {
    const q = doc(db, "trips", tripId);
    try {
      // Construct the reference to the specific trip document
      const querySnapshot = await getDoc(q);
      const tripData = querySnapshot.data();
      setSelectedTrip(tripData);
    } catch (error) {
      console.error("Error fetching trip:", error.message);
      throw error;
    }
  }

  // Function to delete the trip
  const deleteTrip = async () => {
    const q = doc(db, "trips", tripId);
    await Promise.all(
      selectedTrip.places.map(async (place) => {
        const q_place = doc(db, "places", place.id);
        const querySnapshot = await getDoc(q_place);
        const placeData = querySnapshot.data();
        placeData.routes = placeData.routes.filter((id) => id !== tripId);
        await updateDoc(q_place, placeData);
      })
    );
    await deleteDoc(q);
    //setSelectedTrip(emptyTrip);
    // Navigate back to the previous screen
    setHasDelete(true);
    props.navigation.goBack();
  };

  // Load image URIs from AsyncStorage on component mount
  useEffect(() => {
    const loadImageURIs = async () => {
      try {
        const savedImages = await AsyncStorage.getItem(`images_${tripId}`);
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
      } catch (error) {
        console.error("Error loading image URIs:", error.message);
      }
    };

    loadImageURIs();
  }, [tripId]);

  // Save image URIs to AsyncStorage when they change
  useEffect(() => {
    const saveImageURIs = async () => {
      try {
        await AsyncStorage.setItem(`images_${tripId}`, JSON.stringify(images));
      } catch (error) {
        console.error("Error saving image URIs:", error.message);
      }
    };

    saveImageURIs();
  }, [images, tripId]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        multiple: true,
      });

      if (!result.canceled) {
        const selectedUris = result?.uris || [result?.uri];
        setImages([...images, ...selectedUris]);
      }
    } catch (error) {
      console.error("Error during image picking:", error.message);
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Display Trip Name */}
        <Text style={styles.tripName}>{selectedTrip.tripName}</Text>

        {/* Delete Button */}
        <Button mode="text" onPress={deleteTrip} textColor={"#215ED5"}>
          Delete Trip
        </Button>

        {/* Image Picker Button */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerButtonText}>Pick a photo</Text>
        </TouchableOpacity>

        {/* Display selected images in a grid */}
        <View style={styles.imageGrid}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: img }} style={styles.selectedImage} />
              <TouchableOpacity
                onPress={() => deleteImage(index)}
                style={styles.deleteImageButton}
              >
                <Text style={styles.deleteImageButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Map Component */}
        <View style={styles.mapContainer}>
          <MapWithTrip trip={selectedTrip} style={styles.map} />
        </View>

        {/* Related Notes */}
        <Text style={styles.sectionTitle}>Related Notes</Text>
        {/* Loop through trip.notes and display relevant information */}

        {/* You can map through trip.notes here and display relevant information */}
        <TripNote tripId={tripId}></TripNote>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginTop: 20,
    marginBottom: 30,
  },
  tripName: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 8,
    textAlign: "center", // Center the text horizontally
    alignItems: "center", // Center the text vertically
    justifyContent: "center", // Center the text vertically
  },
  mapContainer: {
    flex: 1,
    height: 400,
    margin: 20,
    marginBottom: 40,
  },
  map: {
    flex: 1, // Adjust the flex value as needed
    ...StyleSheet.absoluteFillObject,
    width: "100%", // Set the width to take up the entire space
    height: 300, // Set a specific height or adjust as needed
  },
  imagePickerButton: {
    backgroundColor: "#215ED5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  imageContainer: {
    width: "48%",
    aspectRatio: 1,
    marginVertical: 5,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  deleteImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
  },
  deleteImageButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default TripInfoScreen;
