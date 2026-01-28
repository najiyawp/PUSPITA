import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWlyKbfLCCMgzI2fDCu86aHU3W2TBxyV0",
  authDomain: "puspita-db.firebaseapp.com",
  projectId: "puspita-db",
  storageBucket: "puspita-db.firebasestorage.app",
  messagingSenderId: "526688969857",
  appId: "1:526688969857:web:3303484d091aa94a009980",
  measurementId: "G-Z574F19QP4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };