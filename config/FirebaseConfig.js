// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV0FIkI2o3rNUNO2M6-DEAI7mdcbVMKXE",
  authDomain: "business-directory-app-3572d.firebaseapp.com",
  projectId: "business-directory-app-3572d",
  storageBucket: "business-directory-app-3572d.appspot.com",
  messagingSenderId: "228214962545",
  appId: "1:228214962545:web:0745ae030dbe93559b5ed0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
