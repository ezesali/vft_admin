// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBsHjDXo7T-bwZqACoJgf9qnpOieqGixE0",
  authDomain: "virtual-food-tours-map.firebaseapp.com",
  projectId: "virtual-food-tours-map",
  storageBucket: "virtual-food-tours-map.appspot.com",
  messagingSenderId: "298776502143",
  appId: "1:298776502143:web:18ac0b5186993e85f1044a",
  measurementId: "G-TV8CNM3F7K"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app)

// Firebase storage reference
export const storage = getStorage(app);