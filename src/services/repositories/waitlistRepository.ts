import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";

export type WaitlistEntry = {
  id?: string;
  name: string;
  email: string;
  koreanLevel: "beginner" | "intermediate" | "advanced";
  interestingTopic: string;
  nativeLanguage: string;
  createdAt?: Timestamp;
};

export async function addWaitlistEntry(entry: Omit<WaitlistEntry, "id" | "createdAt">): Promise<void> {
  assertFirestoreAvailable("Adding waitlist entry");
  
  const waitlistCollection = collection(db, "waitlist");
  await addDoc(waitlistCollection, {
    ...entry,
    createdAt: Timestamp.now()
  });
}

