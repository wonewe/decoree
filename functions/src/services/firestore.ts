import * as admin from "firebase-admin";
import {LocalizedEvent, SupportedLanguage} from "../types/event";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const COLLECTION_NAME = "k_culture_events";

export const saveEventToFirestore = async (
  baseEventId: string,
  localizedEvents: LocalizedEvent[]
) => {
  const batch = db.batch();

  localizedEvents.forEach((event) => {
    // Document ID format: {lang}-{eventId}
    const docId = `${event.lang}-${baseEventId}`;
    const docRef = db.collection(COLLECTION_NAME).doc(docId);

    const eventData = {
      ...event,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, eventData, {merge: true});
  });

  await batch.commit();
  console.log(`Saved ${localizedEvents.length} localized events for ID ${baseEventId}`);
};
