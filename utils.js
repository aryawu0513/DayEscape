export async function validTrip(trip) {
  for (let i = 0; i < trip.places.length - 1; i++) {
    const currentPlace = trip.places[i];
    const nextPlace = trip.places[i + 1];
    // Check if transportationMode is null
    if (currentPlace.transportationMode === null) {
      console.error("Transportation mode is null for place", currentPlace.name);
      return {
        feasible: false,
        failedPlace: currentPlace.name,
        lateTime: 0,
      };
    }

    // Call Google Maps Directions API to get real-life trip and estimated travel time
    try {
      console.log("Calling fetchDirections...");
      const directionsResponse = await fetchDirections(
        currentPlace.coordinates,
        nextPlace.coordinates,
        currentPlace.transportationMode
      );

      const estimatedTravelTime = directionsResponse.duration.value / 60;
      trip = updateTripDuration(trip, i, estimatedTravelTime);

      // Calculate actual arriving time at the succeeding place
      const actualArrivingTime = new Date(currentPlace.leaveTime);
      actualArrivingTime.setMinutes(
        actualArrivingTime.getMinutes() + estimatedTravelTime
      );
      //console.log("actualArrivingTime", actualArrivingTime);

      // Check if the user can get to the next place on time
      if (actualArrivingTime > new Date(nextPlace.arriveTime)) {
        // Trip segment is not feasible
        console.log(
          "The trip failed! at place",
          nextPlace.name,
          "Late by",
          (actualArrivingTime - new Date(nextPlace.arriveTime)) / (1000 * 60)
        );
        return {
          feasible: false,
          trip: trip,
          failedPlace: nextPlace.name,
          lateTime:
            (actualArrivingTime - new Date(nextPlace.arriveTime)) / (1000 * 60),
        };
      }
    } catch (error) {
      console.error(`Error fetching directions: ${error.message}`);
      // Handle the error as needed (e.g., show an error message to the user)
      return {
        feasible: false,
        failedPlace: currentPlace.name,
        lateTime: 0, // Set lateTime to 0 for simplicity; adjust as needed
      };
    }
  }
  console.log("The trip works!!");
  console.log(trip);

  return { feasible: true, trip: trip };
}

async function fetchDirections(origin, destination, mode) {
  const API_KEY = "AIzaSyD2K1NnQskqsq17udp2vqYQF_We9kuvf6I";
  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${API_KEY}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(
      `Error fetching directions in fetchDirections. HTTP status: ${response.status}`
    );
  }
  const data = await response.json();

  if (data.status === "OK") {
    return data.routes[0].legs[0];
  } else {
    throw new Error(
      `Directions API request failed with status: ${data.status}`
    );
  }
}

// Example of a generic function to update the trip
function updateTripDuration(trip, index, transportDuration) {
  const updatedPlaces = [...trip.places];
  updatedPlaces[index] = {
    ...updatedPlaces[index],
    transportDuration: transportDuration,
  };

  return {
    ...trip,
    places: updatedPlaces,
  };
}
