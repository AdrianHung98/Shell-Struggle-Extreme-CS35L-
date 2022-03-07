// Import FirebaseAuth and firebase.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyBwWESvYJgPkQ6DZbz4Vhsg_yfcc0nmOlA",
  authDomain: "shell-struggle-extreme.firebaseapp.com",
  databaseURL: "https://shell-struggle-extreme-default-rtdb.firebaseio.com",
  projectId: "shell-struggle-extreme",
  storageBucket: "shell-struggle-extreme.appspot.com",
  messagingSenderId: "363004396843",
  appId: "1:363004396843:web:7c4a156645c98832a9716e"
};

firebase.initializeApp(config);
const firestore = getFirestore();
const auth = getAuth();
const db = getDatabase();

export { firebase, firestore, auth, db }
