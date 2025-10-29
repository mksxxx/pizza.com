import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAQvhdjkE_XRCyTh6gVF0uZbHMtDmWWb2o",
  authDomain: "pizzacom-a7371.firebaseapp.com",
  projectId: "pizzacom-a7371",
  storageBucket: "pizzacom-a7371.firebasestorage.app",
  messagingSenderId: "582396002177",
  appId: "1:582396002177:web:a0ff3efb61f3c3d11bb280"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }