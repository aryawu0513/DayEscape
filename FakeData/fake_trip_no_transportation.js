// fake_trip_no_transportation.js

export const fakeTripNoTransportation = {
  tripName: "Trip to Boston will succeed",
  createTime: "2023-11-27T12:01:30",
  places: [
    {
      name: "MFA Museum",
      coordinates: {
        latitude: 42.34009834595002,
        longitude: -71.09354256326445,
      },
      arriveTime: "2023-11-28T12:00:00",
      leaveTime: "2023-11-29T13:00:00",
      //Distance:1.492 km
      transportationMode: null, //from current place to the next place.
      transportDuration: null, //min to the next place
    },
    {
      name: "Trader Joe's",
      coordinates: {
        latitude: 42.3489134659583,
        longitude: -71.08397537531168,
      },
      arriveTime: "2023-11-29T14:00:00",
      leaveTime: "2023-11-29T16:30:00",
      //Distance:3.066 km
      transportationMode: null,
      transportDuration: null,
    },
    {
      name: "GoodWill",
      coordinates: {
        latitude: 42.364363276961264,
        longitude: -71.10206665252885,
      },
      arriveTime: "2023-11-29T17:00:00",
      leaveTime: "2023-11-29T18:00:00",
      transportationMode: null,
      transportDuration: null,
    },
  ],
};
