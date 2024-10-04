// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAJp6uDDoCP-oRwj7vnuypTRCzGh-Febc",
  authDomain: "biblioteca-masonica-d8cc0.firebaseapp.com",
  projectId: "biblioteca-masonica-d8cc0",
  storageBucket: "biblioteca-masonica-d8cc0.appspot.com",
  messagingSenderId: "486337614034",
  appId: "1:486337614034:web:734895ecae94f1c20f1d0b",
  measurementId: "G-6EG2MFMGME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth instance
const db = getFirestore(app); // Get Firestore instance

export { auth, db };
