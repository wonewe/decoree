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
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const fallbackPhrases = PHRASES.map((phrase) => stripLanguageMeta(ensureLanguage(phrase)));

const filterHidden = (phrases: Phrase[], includeHidden?: boolean) =>
  includeHidden ? phrases : phrases.filter((phrase) => !phrase.hidden);

const toPhrase = (docData: WithTimestamps<Phrase>): Phrase => {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return rest;
};

export async function fetchPhrases(
  language?: SupportedLanguage,
  options?: { includeHidden?: boolean }
): Promise<Phrase[]> {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    return filterHidden(filterByLanguage(fallbackPhrases, language), includeHidden);
  }
  try {
    const snapshot = await getDocs(phraseCollection);
    if (snapshot.empty) {
      return filterHidden(filterByLanguage(fallbackPhrases, language), includeHidden);
    }
    const phrases = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<Phrase>;
      return toPhrase({ ...data, id: docSnap.id });
    });
    return filterHidden(filterByLanguage(phrases, language), includeHidden);
  } catch (error) {
    console.error("Failed to fetch phrases, fallback to static data.", error);
    return filterHidden(filterByLanguage(fallbackPhrases, language), includeHidden);
  }
}

export async function getPhraseById(id: string, options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    const found = fallbackPhrases.find((phrase) => phrase.id === id);
    if (found && !includeHidden && found.hidden) return null;
    return found ?? null;
  }
  try {
    const snapshot = await getDoc(doc(phraseCollection, id));
    if (snapshot.exists()) {
      const phrase = toPhrase({ ...(snapshot.data() as Phrase), id: snapshot.id });
      if (!includeHidden && phrase.hidden) return null;
      return phrase;
    }
  } catch (error) {
    console.error("Unable to fetch phrase by id", error);
  }
  const found = fallbackPhrases.find((phrase) => phrase.id === id);
  if (found && !includeHidden && found.hidden) return null;
  return found ?? null;
}

export async function addPhrase(phrase: Phrase) {
  assertFirestoreAvailable("Adding a phrase");
  const id = phrase.id;
  const payload: Phrase & { createdAt: Timestamp; updatedAt: Timestamp } = {
    ...phrase,
    language: phrase.language ?? DEFAULT_LANGUAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(phraseCollection, id), payload, { merge: true });
  return fetchPhrases(undefined, { includeHidden: true });
}

export async function updatePhrase(phrase: Phrase) {
  assertFirestoreAvailable("Updating a phrase");
  await setDoc(
    doc(phraseCollection, phrase.id),
    {
      ...phrase,
      language: phrase.language ?? DEFAULT_LANGUAGE,
      updatedAt: Timestamp.now()
    },
    { merge: true }
  );
  return fetchPhrases(undefined, { includeHidden: true });
}

export async function deletePhrase(id: string) {
  assertFirestoreAvailable("Deleting a phrase");
  await deleteDoc(doc(phraseCollection, id));
  return fetchPhrases(undefined, { includeHidden: true });
}
