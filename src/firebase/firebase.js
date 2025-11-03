import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQvhdjkE_XRCyTh6gVF0uZbHMtDmWWb2o",
  authDomain: "topvideos-b9bf3.firebaseapp.com",
  databaseURL: "https://topvideos-b9bf3-default-rtdb.firebaseio.com",
  projectId: "topvideos-b9bf3",
  storageBucket: "topvideos-b9bf3.appspot.com", // ✅ CORRIGIDO
  messagingSenderId: "33248689209",
  appId: "1:33248689209:web:2f66c87850c907015e61e8"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Serviços
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
