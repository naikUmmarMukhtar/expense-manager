import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "./lib/constants";

const app = initializeApp(FIREBASE_CONFIG);

const auth = getAuth(app);

export { auth };
