import { collection, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "../firebase";

const app = getFirebaseApp();
export const db = getFirestore(app);

export const trendCollection = collection(db, "trends");
export const eventCollection = collection(db, "events");
export const phraseCollection = collection(db, "phrases");
export const popupCollection = collection(db, "popups");
export const courseCollection = collection(db, "courses");
export const enrollmentCollection = collection(db, "enrollments");
