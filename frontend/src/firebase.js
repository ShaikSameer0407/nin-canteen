// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrY66n1t61W0DQONnA5QWg1JMTK04LCOE",
  authDomain: "nin-canteen.firebaseapp.com",
  projectId: "nin-canteen",
  storageBucket: "nin-canteen.appspot.com",
  messagingSenderId: "190096338621",
  appId: "1:190096338621:web:5e1a541e3dbdcee3aad1d4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
