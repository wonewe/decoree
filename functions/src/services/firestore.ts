import * as admin from "firebase-admin";
import { LocalizedEvent } from "../types/event";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const COLLECTION_NAME = "events";

export const saveEventToFirestore = async (
  baseEventId: string,
  localizedEvents: LocalizedEvent[]
) => {
  const batch = db.batch();

  // First, fetch existing documents to preserve createdAt timestamps
  const docIds = localizedEvents.map((event) => `${event.language}-${baseEventId}`);
  const existingDocs = await Promise.all(
    docIds.map((docId) => db.collection(COLLECTION_NAME).doc(docId).get())
  );

  localizedEvents.forEach((event, index) => {
    const docId = `${event.language}-${baseEventId}`;
    const docRef = db.collection(COLLECTION_NAME).doc(docId);
    const existingDoc = existingDocs[index];

    const eventData = {
      ...event,
      // Preserve original createdAt if exists, otherwise create new one
      createdAt: existingDoc.exists && existingDoc.data()?.createdAt
        ? existingDoc.data()!.createdAt
        : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Use set without merge to completely overwrite with latest data
    batch.set(docRef, eventData);
  });

  await batch.commit();
  console.log(`Saved ${localizedEvents.length} localized events for ID ${baseEventId}`);
};
