import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCm7-s4qd0YQe89wYHK-ib3_Gkk5vonjbc",
  authDomain: "internship-project-2d609.firebaseapp.com",
  projectId: "internship-project-2d609",
  storageBucket: "internship-project-2d609.appspot.com",
  messagingSenderId: "584897743787",
  appId: "1:584897743787:web:2f27e1c90d40a5b5c0e0ee"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };
export const auth = getAuth()