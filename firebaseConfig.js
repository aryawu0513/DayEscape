// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCxOMdzquTanc17Ah13x6RJAWnG1ClL5e8",
  authDomain: "dayescape-61e26.firebaseapp.com",
  projectId: "dayescape-61e26",
  storageBucket: "dayescape-61e26.appspot.com",
  messagingSenderId: "985948527846",
  appId: "1:985948527846:web:310d8428d176141da9ef27",
  measurementId: "G-2YK3Z4P1KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);