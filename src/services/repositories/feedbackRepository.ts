import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

export type FeedbackEntry = {
  id: string;
  message: string;
  language?: string;
  suggestionType?: "popup" | "event";
  suggestionId?: string;
  createdAt?: Timestamp;
};

export async function fetchFeedbacks(): Promise<FeedbackEntry[]> {
  assertFirestoreAvailable("Fetching feedback");
  if (shouldUseStaticContent()) {
    return [];
  }
  const snap = await getDocs(query(collection(db, "feedback"), orderBy("createdAt", "desc")));
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as FeedbackEntry) }));
}
