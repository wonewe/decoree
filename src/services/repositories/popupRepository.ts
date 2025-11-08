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
import { popupCollection } from "./firestoreClient";
import { POPUP_EVENTS, type PopupEvent } from "../../data/popups";
import type { SupportedLanguage } from "../../shared/i18n";
import { DEFAULT_LANGUAGE, ensureLanguage, filterByLanguage, stripLanguageMeta } from "./languageUtils";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const fallbackPopups = POPUP_EVENTS.map((popup) => stripLanguageMeta(ensureLanguage(popup)));

const toPopup = (docData: WithTimestamps<PopupEvent>): PopupEvent => {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return rest;
};

export async function fetchPopups(language?: SupportedLanguage): Promise<PopupEvent[]> {
  if (shouldUseStaticContent()) {
    return filterByLanguage(fallbackPopups, language);
  }
  try {
    const snapshot = await getDocs(query(popupCollection, orderBy("window", "asc")));
    if (snapshot.empty) {
      return filterByLanguage(fallbackPopups, language);
    }
    const popups = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<PopupEvent>;
      return toPopup({ ...data, id: docSnap.id });
    });
    return filterByLanguage(popups, language);
  } catch (error) {
    console.error("Failed to fetch popups, fallback to static data.", error);
    return filterByLanguage(fallbackPopups, language);
  }
}

export async function getPopupById(id: string) {
  if (shouldUseStaticContent()) {
    return fallbackPopups.find((popup) => popup.id === id) ?? null;
  }
  try {
    const snapshot = await getDoc(doc(popupCollection, id));
    if (snapshot.exists()) {
      return toPopup({ ...(snapshot.data() as PopupEvent), id: snapshot.id });
    }
  } catch (error) {
    console.error("Unable to fetch popup by id", error);
  }
  return fallbackPopups.find((popup) => popup.id === id) ?? null;
}

export async function addPopup(popup: PopupEvent) {
  assertFirestoreAvailable("Adding a popup event");
  const payload: PopupEvent & { createdAt: Timestamp; updatedAt: Timestamp } = {
    ...popup,
    language: popup.language ?? DEFAULT_LANGUAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(popupCollection, popup.id), payload, { merge: true });
  return fetchPopups();
}

export async function updatePopup(popup: PopupEvent) {
  assertFirestoreAvailable("Updating a popup event");
  await setDoc(
    doc(popupCollection, popup.id),
    {
      ...popup,
      language: popup.language ?? DEFAULT_LANGUAGE,
      updatedAt: Timestamp.now()
    },
    { merge: true }
  );
  return fetchPopups();
}

export async function deletePopup(id: string) {
  assertFirestoreAvailable("Deleting a popup event");
  await deleteDoc(doc(popupCollection, id));
  return fetchPopups();
}
