export async function validRoute(route) {
  for (let i = 0; i < route.places.length - 1; i++) {
    const currentPlace = route.places[i];
    const nextPlace = route.places[i + 1];
    // Check if transportationMode is null
    if (currentPlace.transportationMode === null) {
      console.error("Transportation mode is null for place", currentPlace.name);
      return {
        feasible: false,
        failedPlace: currentPlace.name,
        lateTime: 0,
      };
    }

    // Call Google Maps Directions API to get real-life route and estimated travel time
    try {
      console.log("Calling fetchDirections...");
      const directionsResponse = await fetchDirections(
        currentPlace.coordinates,
        nextPlace.coordinates,
        currentPlace.transportationMode
      );

      const estimatedTravelTime = directionsResponse.duration.value / 60;
      route = updateRouteDuration(route, i, estimatedTravelTime);

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
          "The route failed! at place",
          nextPlace.name,
          "Late by",
          (actualArrivingTime - new Date(nextPlace.arriveTime)) / (1000 * 60)
        );
        return {
          feasible: false,
          route: route,
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
  console.log("The route works!!");
  console.log(route);

  return { feasible: true, route: route };
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

// Example of a generic function to update the route
function updateRouteDuration(route, index, transportDuration) {
  const updatedPlaces = [...route.places];
  updatedPlaces[index] = {
    ...updatedPlaces[index],
    transportDuration: transportDuration,
  };

  return {
    ...route,
    places: updatedPlaces,
  };
}

// Example of a generic function to update the route name
function updateRouteName(route, routeName) {
  return {
    ...route,
    routeName: routeName,
  };
}

export default updateRouteName;
