// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIsVVOvsHD6CdfXX7N04hhO1tUS1VNI7g",
  authDomain: "complaint-management-sys-f0f45.firebaseapp.com",
  projectId: "complaint-management-sys-f0f45",
  storageBucket: "complaint-management-sys-f0f45.firebasestorage.app",
  messagingSenderId: "289945642524",
  appId: "1:289945642524:web:6c13ffe886e7bf983361d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;