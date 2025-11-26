import { addDoc, collection, Timestamp, getFirestore } from "firebase/firestore";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./repositories/runtimeConfig";
import { getFirebaseApp } from "./firebase";

type FeedbackPayload = {
  message: string;
  language?: string;
  suggestionType?: "popup" | "event";
  suggestionId?: string;
};

export async function submitFeedback(payload: FeedbackPayload) {
  const fallbackToLocal = () => {
    try {
      const key = "koraid:feedback:local";
      const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const store = existing ? (JSON.parse(existing) as Array<FeedbackPayload & { createdAt: string }>) : [];
      store.unshift({ ...payload, createdAt: new Date().toISOString() });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(store.slice(0, 50)));
      }
      return { ok: true, local: true as const };
    } catch (error) {
      console.error("Failed to store feedback locally", error);
      return { ok: false, error: error instanceof Error ? error.message : "local-storage" };
    }
  };

  try {
    assertFirestoreAvailable("Submitting feedback");
    if (shouldUseStaticContent()) {
      return fallbackToLocal();
    }
    const app = getFirebaseApp();
    const db = getFirestore(app);
    const feedbackCollection = collection(db, "feedback");
    await addDoc(feedbackCollection, {
      ...payload,
      createdAt: Timestamp.now()
    });
    return { ok: true };
  } catch (error) {
    console.warn("Failed to submit feedback to Firestore, falling back to local store.", error);
    return fallbackToLocal();
  }
}
