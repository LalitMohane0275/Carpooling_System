// frontend/src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcumfCCkOR4YhAggpAVlxFuuGexZeJIW8",
  authDomain: "carpooling-ridebuddy.firebaseapp.com",
  projectId: "carpooling-ridebuddy",
  storageBucket: "carpooling-ridebuddy.firebasestorage.app",
  messagingSenderId: "901316472638",
  appId: "1:901316472638:web:1dd17aa5cd1e0320fd066f",
  measurementId: "G-NGQM6R81LX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);