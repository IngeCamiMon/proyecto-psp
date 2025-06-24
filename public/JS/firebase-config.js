// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD79umLr6iHPqM6f_IzSVgeEu3qopxqTCw",
  authDomain: "restaturante-psp.firebaseapp.com",
  projectId: "restaturante-psp",
  storageBucket: "restaturante-psp.firebasestorage.app",
  messagingSenderId: "180701892199",
  appId: "1:180701892199:web:3f71488b64af85c1b20ec2",
  measurementId: "G-60LENBP3CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);