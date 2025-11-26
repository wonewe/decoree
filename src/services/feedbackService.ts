import { addDoc, collection, Timestamp } from "firebase/firestore";
import { assertFirestoreAvailable } from "./repositories/runtimeConfig";
import { db } from "./repositories/firestoreClient";

type FeedbackPayload = {
  message: string;
  language?: string;
  suggestionType?: "popup" | "event";
  suggestionId?: string;
};

export async function submitFeedback(payload: FeedbackPayload) {
  try {
    assertFirestoreAvailable("Submitting feedback");
    const feedbackCollection = collection(db, "feedback");
    await addDoc(feedbackCollection, {
      ...payload,
      createdAt: Timestamp.now()
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to submit feedback", error);
    return { ok: false, error: error instanceof Error ? error.message : "unknown" };
  }
}
