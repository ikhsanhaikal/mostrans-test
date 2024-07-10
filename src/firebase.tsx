import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY_FIRESTORE,
  authDomain: import.meta.env.VITE_AUTHDOMAIN_FIRESTORE,
  projectId: import.meta.env.VITE_PROJECTID_FIRESTORE,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET_FIRESTORE,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID_FIRESTORE,
  appId: import.meta.env.VITE_APPID_FIRESTORE,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
