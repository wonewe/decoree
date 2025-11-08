import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { eventCollection } from "./firestoreClient";
import { K_CULTURE_EVENTS, type KCultureEvent } from "../../data/events";
import type { SupportedLanguage } from "../../shared/i18n";
import { DEFAULT_LANGUAGE, ensureLanguage, filterByLanguage, stripLanguageMeta } from "./languageUtils";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const fallbackEvents = K_CULTURE_EVENTS.map((event) => stripLanguageMeta(ensureLanguage(event)));

const toEvent = (docData: WithTimestamps<KCultureEvent>): KCultureEvent => {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return {
    ...rest,
    longDescription: rest.longDescription ?? [],
    tips: rest.tips ?? []
  };
};

export async function fetchEvents(language?: SupportedLanguage): Promise<KCultureEvent[]> {
  if (shouldUseStaticContent()) {
    return filterByLanguage(fallbackEvents, language);
  }
  try {
    const snapshot = await getDocs(query(eventCollection, orderBy("date", "asc")));
    if (snapshot.empty) {
      return filterByLanguage(fallbackEvents, language);
    }
    const events = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<KCultureEvent>;
      return toEvent({ ...data, id: docSnap.id });
    });
    return filterByLanguage(events, language);
  } catch (error) {
    console.error("Failed to fetch events, fallback to static data.", error);
    return filterByLanguage(fallbackEvents, language);
  }
}

export async function getEventById(id: string) {
  if (shouldUseStaticContent()) {
    return fallbackEvents.find((event) => event.id === id) ?? null;
  }
  try {
    const snapshot = await getDoc(doc(eventCollection, id));
    if (snapshot.exists()) {
      return toEvent({ ...(snapshot.data() as KCultureEvent), id: snapshot.id });
    }
  } catch (error) {
    console.error("Unable to fetch event by id", error);
  }
  return fallbackEvents.find((event) => event.id === id) ?? null;
}

export async function addEvent(event: KCultureEvent) {
  assertFirestoreAvailable("Adding an event");
  const id = event.id;
  const payload: KCultureEvent & { createdAt: Timestamp; updatedAt: Timestamp } = {
    ...event,
    language: event.language ?? DEFAULT_LANGUAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(eventCollection, id), payload, { merge: true });
  return fetchEvents();
}

export async function updateEvent(event: KCultureEvent) {
  assertFirestoreAvailable("Updating an event");
  await setDoc(
    doc(eventCollection, event.id),
    {
      ...event,
      language: event.language ?? DEFAULT_LANGUAGE,
      updatedAt: Timestamp.now()
    },
    { merge: true }
  );
  return fetchEvents();
}

export async function deleteEvent(id: string) {
  assertFirestoreAvailable("Deleting an event");
  await deleteDoc(doc(eventCollection, id));
  return fetchEvents();
}
