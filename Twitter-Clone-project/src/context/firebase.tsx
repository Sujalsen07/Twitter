import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw5PQENONnr__EFsLNRFjgk1fxqj1DZAU",
  authDomain: "twiller-7209e.firebaseapp.com",
  projectId: "twiller-7209e",
  storageBucket: "twiller-7209e.appspot.com", // ✅ fixed here
  messagingSenderId: "853710073033",
  appId: "1:853710073033:web:38c954c1b9f640c2a67118",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
