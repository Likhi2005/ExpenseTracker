// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkSWSuZIdC474F7Loe7DLOnYWqwFQ2Sp8",
    authDomain: "expense-tracker-a4566.firebaseapp.com",
    projectId: "expense-tracker-a4566",
    storageBucket: "expense-tracker-a4566.firebasestorage.app",

    // storageBucket: "expense-tracker-a4566.appspot.com",
    messagingSenderId: "450182388590",
    appId: "1:450182388590:web:fee9a43f6065a58784ff7f",
    measurementId: "G-4Z207PJ2JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth,analytics };