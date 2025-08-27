import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// **** زانیاریێن Firebase یێن تە ****
const firebaseConfig = {
    apiKey: "AIzaSyAS2Y-0zM2XdvGMCS7zwFPnEzutaKiyGzQ",
    authDomain: "myjob-11496.firebaseapp.com",
    projectId: "myjob-11496",
    storageBucket: "myjob-11496.appspot.com",
    messagingSenderId: "149856936848",
    appId: "1:149856936848:web:f91e76308cc43ad1e9c915",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // Em ê vî paşê bikar bînin