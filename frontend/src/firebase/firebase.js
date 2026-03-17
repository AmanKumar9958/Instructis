import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDZqMcNIRycEaMM0dCeD430wQtzAOuYCFU",
    authDomain: "instructis.firebaseapp.com",
    projectId: "instructis",
    storageBucket: "instructis.firebasestorage.app",
    messagingSenderId: "492690569696",
    appId: "1:492690569696:web:66bf201c8f3889f7985385",
    measurementId: "G-TDXY3VCYQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);