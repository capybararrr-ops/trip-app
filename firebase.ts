// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZG_rwmlaMNI7rS2ecAsO_4WINKkgKylA",
  authDomain: "mytravelapp-ff142.firebaseapp.com",
  projectId: "mytravelapp-ff142",
  storageBucket: "mytravelapp-ff142.firebasestorage.app",
  messagingSenderId: "1033187254446",
  appId: "1:1033187254446:web:3b25fac493cad7dc3d0d3f",
  measurementId: "G-MGCFLXHRS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);