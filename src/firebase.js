// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOTWe2to5vUExVdhbysp2Eo1-Dy5PsrAU",
  authDomain: "doctor-2189f.firebaseapp.com",
  projectId: "doctor-2189f",
  storageBucket: "doctor-2189f.appspot.com",
  messagingSenderId: "314401362607",
  appId: "1:314401362607:web:d72d0ca1bbeda962517a5a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);