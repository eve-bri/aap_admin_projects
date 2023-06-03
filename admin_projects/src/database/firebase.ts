import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAQNRz7wh0CxeY-ozBrVsURGIwZUKgqj9Q",
    authDomain: "admin-projects-app.firebaseapp.com",
    projectId: "admin-projects-app",
    storageBucket: "admin-projects-app.appspot.com",
    messagingSenderId: "75777451504",
    appId: "1:75777451504:web:b1f294639b0ae2c3b6e935"
};
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

export {
    firebase, db
  }