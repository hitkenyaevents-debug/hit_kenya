import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA0T8B5RYB4hCypRcaZk4tBTETBiukxaI",
  authDomain: "hitkenya-f1923.firebaseapp.com",
  projectId: "hitkenya-f1923",
  storageBucket: "hitkenya-f1923.firebasestorage.app",
  messagingSenderId: "876353038186",
  appId: "1:876353038186:web:98356af04fb2c46b27a713",
  measurementId: "G-ELBKENXSKX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);