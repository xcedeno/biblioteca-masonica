// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);