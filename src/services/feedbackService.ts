import { addDoc, collection, Timestamp } from "firebase/firestore";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./repositories/runtimeConfig";
import { db } from "./repositories/firestoreClient";

type FeedbackPayload = {
  message: string;
  language?: string;
  suggestionType?: "popup" | "event";
  suggestionId?: string;
};

export async function submitFeedback(payload: FeedbackPayload) {
  try {
    if (shouldUseStaticContent()) {
      const key = "koraid:feedback:local";
      const storeRaw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const store = storeRaw ? (JSON.parse(storeRaw) as FeedbackPayload[]) : [];
      store.unshift({ ...payload, createdAt: new Date().toISOString() } as any);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(store.slice(0, 50)));
      }
      return { ok: true };
    }

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
