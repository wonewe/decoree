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
      const sanitized: FeedbackPayload & { createdAt: string } = {
        message: payload.message?.trim() ?? "",
        language: payload.language ?? "unknown",
        createdAt: new Date().toISOString()
      };
      if (payload.suggestionType) sanitized.suggestionType = payload.suggestionType;
      if (payload.suggestionId) sanitized.suggestionId = payload.suggestionId;

      store.unshift(sanitized);
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
    const message = payload.message?.trim();
    if (!message) {
      return { ok: false, error: "empty-message" };
    }

    const sanitized: FeedbackPayload & { createdAt: Timestamp } = {
      message,
      language: payload.language ?? "unknown",
      createdAt: Timestamp.now()
    };
    if (payload.suggestionType) sanitized.suggestionType = payload.suggestionType;
    if (payload.suggestionId) sanitized.suggestionId = payload.suggestionId;

    assertFirestoreAvailable("Submitting feedback");
    if (shouldUseStaticContent()) {
      return fallbackToLocal();
    }
    const app = getFirebaseApp();
    const db = getFirestore(app);
    const feedbackCollection = collection(db, "feedback");
    await addDoc(feedbackCollection, sanitized);
    return { ok: true };
  } catch (error) {
    console.warn("Failed to submit feedback to Firestore, falling back to local store.", error);
    return fallbackToLocal();
  }
}
