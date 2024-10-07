// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCukSWgCCcvAAOlfM_LcEc5v0UTZOWwiYM",
  authDomain: "salfa-capacitaciones.firebaseapp.com",
  projectId: "salfa-capacitaciones",
  storageBucket: "salfa-capacitaciones.appspot.com",
  messagingSenderId: "140131417117",
  appId: "1:140131417117:web:ee7af96f17ea1c6bd31af4",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
