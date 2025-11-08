import { collection, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "../firebase";

const app = getFirebaseApp();
const db = getFirestore(app);

export const trendCollection = collection(db, "trends");
export const eventCollection = collection(db, "events");
export const phraseCollection = collection(db, "phrases");
export const popupCollection = collection(db, "popups");
