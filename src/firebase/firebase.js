// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa o serviço de Autenticação
import { getDatabase } from "firebase/database"; // Importa o serviço do Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQvhdjkE_XRCyTh6gVF0uZbHMtDmWWb2o",
  authDomain: "topvideos-b9bf3.firebaseapp.com",
  databaseURL: "https://topvideos-b9bf3-default-rtdb.firebaseio.com",
  projectId: "topvideos-b9bf3",
  storageBucket: "topvideos-b9bf3.firebasestorage.app",
  messagingSenderId: "33248689209",
  appId: "1:33248689209:web:2f66c87850c907015e61e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase, passando 'app' como argumento (boa prática)
const auth = getAuth(app);
const database = getDatabase(app);

// Exporta as instâncias dos serviços que serão utilizadas no seu componente Vue
export { auth, database };
