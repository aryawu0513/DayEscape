import React, { useContext, useState, useEffect } from "react";
import { Image, View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import MapWithTrip from "../Components/MapWithTrip";
import * as ImagePicker from "expo-image-picker";
import StateContext from "../Components/StateContext";
import { emptyTrip } from "../FakeData/empty_trip";
import {
  // for Firestore access
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  // for Firebase storage access (to store images)
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import PersistentNote from "../Components/PersistentNote";
import TripNote from "../Components/TripNote";

const TripInfoScreen = (props) => {
  const { selectedTripProps, firebaseProps } = useContext(StateContext);
  const { selectedTrip, setSelectedTrip, hasDelete, setHasDelete } =
    selectedTripProps;
  const { db, storage } = firebaseProps;
  // New state variable for storing image URIs
  //const [postImageUri, setPostImageUri] = useState(null);

  // Assuming that route.params.tripId contains the ID of the selected trip
  const tripId = selectedTrip.createTime;

  useEffect(() => {
    getTrip();
  }, []);

  // useEffect(() => {
  //   console.log("Post image URI (useEffect):", postImageUri);
  // }, [postImageUri]);

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

  async function addImageToTrip() {
    const thisImage = await pickImage();
    console.log("Post image URI:", thisImage);

    // Check if an image is selected
    if (thisImage) {
      try {
        // Display loading indicator or perform any other necessary UI actions
        console.log("HERE AWAITS");
        // Upload the image to Firebase Storage
        const imageDownloadURL = await uploadImageToStorage(thisImage);
        console.log("THERE imageDownloadURL", imageDownloadURL);
      } catch (error) {
        console.error("Error storing image:", error.message);
        // Display error message or perform error handling
      }
    }
  }

  // Helper function to upload the image to Firebase Storage
  //firebasepostmessagewithimages
  async function uploadImageToStorage(imageUri) {
    // Create a storage reference
    // console.log("create the storage please");
    const timestamp = Date.now();
    const storageRef = ref(storage, `tripImages/${timestamp}`);

    // Get the image blob
    const response = await fetch(imageUri);
    const imageBlob = await response.blob();

    // Upload the image to storage
    const uploadTask = uploadBytesResumable(storageRef, imageBlob);
    console.log(`Uploading image for trip? with timestamp ${timestamp} ...`);

    uploadTask.on(
      "state_changed",
      // This callback is called with a snapshot on every progress update
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded
        // and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      // This callback is called when there's an error in the upload
      (error) => {
        console.error(error);
      },
      // This callback is called when the upload is finished
      async function () {
        console.log(
          `Uploading image for trip with timestamp ${timestamp} succeeded!`
        );
        // Once the upload is finished, get the downloadURL for the uploaed image
        const downloadURL = await getDownloadURL(storageRef);
        console.log(
          `Image for trip with timestamp ${timestamp} available at ${downloadURL}`
        );
        updateTripWithImage(downloadURL);
        // Clear postImageUri in preparation for the next message composition.
        //setPostImageUri(null);
        return downloadURL;
      }
    ); // end arguments to uploadTask.on
  }

  // Helper function to update the trip data in Firestore with the image URL
  async function updateTripWithImage(imageURL) {
    console.log(
      "update trip yet? selected trip ",
      selectedTrip,
      "image URL is ",
      imageURL
    );
    try {
      // Assuming `selectedTrip` is the current trip object
      const tripDocRef = doc(db, "trips", tripId);
      console.log("Trip Document Reference:", tripDocRef);

      // Update the trip data with the image URL
      const updatedTrip = {
        ...selectedTrip,
        images: [...selectedTrip.images, imageURL],
      };
      console.log("OMGOMG", updatedTrip);
      await updateDoc(tripDocRef, updatedTrip);
      // Update the local state with the modified trip data
      setSelectedTrip(updatedTrip);
    } catch (error) {
      console.error("Error updating trip with image:", error.message);
      // Display error message or perform error handling
      throw error;
    }
  }
  /**
   * Pick an image from the device's image gallery and store it in
   * the state variable postImageUri.
   * For a simple demonstration of image picking, see the Snack
   * https://snack.expo.dev/@fturbak/image-picker-example
   */
  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], // desired aspect ratio of images
      quality: 1,
    });

    console.log("Picked image:", result.canceled);

    // if (!result.canceled) {???
    console.log(result.assets[0].uri);
    //setPostImageUri(result.assets[0].uri);
    // }
    return result.assets[0].uri;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Display Trip Name */}
        <Text style={styles.tripName}>{selectedTrip.tripName}</Text>

        {/* Delete Button */}
        <Button mode="text" onPress={deleteTrip} textColor={"#215ED5"}>
          Delete Trip
        </Button>
        {/* Map Component */}
        {/* <View style={styles.mapContainer}>
          <MapWithTrip trip={selectedTrip} style={styles.map} />
        </View> */}
        <Button
          mode="contained"
          // style={globalStyles.button}
          // labelStyle={globalStyles.buttonText}
          onPress={() => addImageToTrip()}
        >
          Add Image
        </Button>
        {/* Display Trip Images */}
        {selectedTrip.images && selectedTrip.images.length > 0 && (
          <View style={styles.imageContainer}>
            {selectedTrip.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </View>
        )}
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    resizeMode: "cover",
    margin: 5,
  },
});

export default TripInfoScreen;
