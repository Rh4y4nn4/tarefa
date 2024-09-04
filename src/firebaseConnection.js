import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBA_4m7Gt-eNCavreFpdABFNVvYY90ctQ4",
  authDomain: "tarefas-464be.firebaseapp.com",
  projectId: "tarefas-464be",
  storageBucket: "tarefas-464be.appspot.com",
  messagingSenderId: "751608781485",
  appId: "1:751608781485:web:4cbfd19c8c9c502d924424",
  measurementId: "G-R1QHMPWC9S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
