// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore, doc, setDoc} from "firebase/firestore"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUfNMM7SBk5NiE5bCfLl2a1YSNRYjsYs0",
  authDomain: "finance-app-396dc.firebaseapp.com",
  projectId: "finance-app-396dc",
  storageBucket: "finance-app-396dc.appspot.com",
  messagingSenderId: "226159010702",
  appId: "1:226159010702:web:b021dede2166cadcce3adf",
  measurementId: "G-Y1DCYQCZKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{db, auth, provider, doc, setDoc};
