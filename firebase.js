// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6aZLVza-BN55P7w9kw660yRZ_1E0DxSg",
  authDomain: "pantry-tracker-2bffd.firebaseapp.com",
  projectId: "pantry-tracker-2bffd",
  storageBucket: "pantry-tracker-2bffd.appspot.com",
  messagingSenderId: "999690717384",
  appId: "1:999690717384:web:c268eedd59950f8029fdfd",
  measurementId: "G-180RGTNVR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
