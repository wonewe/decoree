import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { phraseCollection } from "./firestoreClient";
import { PHRASES, type Phrase } from "../../data/phrases";
import type { SupportedLanguage } from "../../shared/i18n";
import { DEFAULT_LANGUAGE, ensureLanguage, filterByLanguage, stripLanguageMeta } from "./languageUtils";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const fallbackPhrases = PHRASES.map((phrase) => stripLanguageMeta(ensureLanguage(phrase)));

const toPhrase = (docData: WithTimestamps<Phrase>): Phrase => {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return rest;
};

export async function fetchPhrases(language?: SupportedLanguage): Promise<Phrase[]> {
  try {
    const snapshot = await getDocs(phraseCollection);
    if (snapshot.empty) {
      return filterByLanguage(fallbackPhrases, language);
    }
    const phrases = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<Phrase>;
      return toPhrase({ ...data, id: docSnap.id });
    });
    return filterByLanguage(phrases, language);
  } catch (error) {
    console.error("Failed to fetch phrases, fallback to static data.", error);
    return filterByLanguage(fallbackPhrases, language);
  }
}

export async function getPhraseById(id: string) {
  try {
    const snapshot = await getDoc(doc(phraseCollection, id));
    if (snapshot.exists()) {
      return toPhrase({ ...(snapshot.data() as Phrase), id: snapshot.id });
    }
  } catch (error) {
    console.error("Unable to fetch phrase by id", error);
  }
  return fallbackPhrases.find((phrase) => phrase.id === id) ?? null;
}

export async function addPhrase(phrase: Phrase) {
  const id = phrase.id;
  const payload: Phrase & { createdAt: Timestamp; updatedAt: Timestamp } = {
    ...phrase,
    language: phrase.language ?? DEFAULT_LANGUAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(phraseCollection, id), payload, { merge: true });
  return fetchPhrases();
}

export async function updatePhrase(phrase: Phrase) {
  await setDoc(
    doc(phraseCollection, phrase.id),
    {
      ...phrase,
      language: phrase.language ?? DEFAULT_LANGUAGE,
      updatedAt: Timestamp.now()
    },
    { merge: true }
  );
  return fetchPhrases();
}

export async function deletePhrase(id: string) {
  await deleteDoc(doc(phraseCollection, id));
  return fetchPhrases();
}
