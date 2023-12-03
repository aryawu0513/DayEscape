// fake_route.js

export const fakeRoutes = [
  {
    routeName: "Trip to Boston will succeed",
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
        transportationMode: "walking", //from current place to the next place.
        transportDuration: 21.4, //21.4 min to the next place
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
        transportationMode: "driving",
        transportDuration: 12.65, //12.65
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
  },
  {
    routeName: "Trip to Boston will fail at Trader Joes 21 min",
    createTime: "2023-11-28T19:30:03",
    places: [
      {
        name: "MFA Museum",
        coordinates: {
          latitude: 42.34009834595002,
          longitude: -71.09354256326445,
        },
        arriveTime: "2023-11-28T12:00:00",
        leaveTime: "2023-11-29T14:00:00",
        //Distance:1.492 km
        transportationMode: "walking", //from current place to the next place.
        transportDuration: 21.4, //min to the next place
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
        transportationMode: "driving",
        transportDuration: 12.65,
      },
      {
        name: "GoodWill",
        coordinates: {
          latitude: 42.364363276961264,
          longitude: -71.10206665252885,
        },
        arriveTime: "2023-11-29T17:00:00",
        leaveTime: "2023-11-29T18:00:00",
        transportationMode: "bicycling",
        transportDuration: 10,
      },
    ],
  },
  // Add more fake routes as needed
];
