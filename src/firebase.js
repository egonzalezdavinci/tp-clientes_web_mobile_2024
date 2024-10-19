import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
import { getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCRttM3UZdrEMtVxs8uBCNOj_2DBs5mXu0",
  authDomain: "app-clientes-web-tp-2024.firebaseapp.com",
  projectId: "app-clientes-web-tp-2024",
  storageBucket: "app-clientes-web-tp-2024.appspot.com",
  messagingSenderId: "765709702222",
  appId: "1:765709702222:web:c9f390205d2cda4ebe9f1f",
  measurementId: "G-XPDE3ML9BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app);

export {db, auth};

