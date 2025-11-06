import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp
} from "firebase/firestore";
import { K_CULTURE_EVENTS, type KCultureEvent } from "../data/events";
import { PHRASES, type Phrase } from "../data/phrases";
import { TREND_REPORTS, type TrendReport } from "../data/trends";
import { AUTHOR_PROFILES } from "../data/authors";
import type { SupportedLanguage } from "../shared/i18n";
import { getFirebaseApp } from "./firebase";

const app = getFirebaseApp();
const db = getFirestore(app);

const trendCollection = collection(db, "trends");
const eventCollection = collection(db, "events");
const phraseCollection = collection(db, "phrases");

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const DEFAULT_LANGUAGE: SupportedLanguage = "en";
const DEFAULT_AUTHOR_ID = AUTHOR_PROFILES[0]?.id ?? "decorée-team";

const LANGUAGE_PREFIXES: SupportedLanguage[] = ["en", "fr", "ko", "ja"];

const inferLanguageFromId = (id: string | undefined): SupportedLanguage | undefined => {
  if (!id) return undefined;
  const prefix = id.split("-")[0] as SupportedLanguage;
  return LANGUAGE_PREFIXES.includes(prefix) ? prefix : undefined;
};

type WithLanguageMeta<T> = T & { language: SupportedLanguage; __softLanguage?: boolean };

const ensureLanguage = <T extends { language?: SupportedLanguage; id?: string }>(item: T) => {
  const inferred = inferLanguageFromId(item.id);
  const hasExplicitLanguage = item.language != null;
  const language = item.language ?? inferred ?? DEFAULT_LANGUAGE;
  return {
    ...item,
    language,
    __softLanguage: !hasExplicitLanguage && !inferred
  } as WithLanguageMeta<T>;
};

const stripLanguageMeta = <T extends WithLanguageMeta<unknown>>(item: T) => {
  const { __softLanguage, ...rest } = item;
  return rest as Omit<T, "__softLanguage">;
};

const filterByLanguage = <T extends { language?: SupportedLanguage; id?: string }>(
  items: T[],
  language?: SupportedLanguage
) => {
  const normalized = items.map(ensureLanguage);
  if (!language) {
    return normalized.map(stripLanguageMeta);
  }
  return normalized
    .filter((item) => item.language === language || item.__softLanguage)
    .map(stripLanguageMeta);
};

const sortReports = (reports: TrendReport[]) =>
  [...reports].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

const fallbackTrends = TREND_REPORTS.map((report) => {
  const normalized = ensureLanguage(report);
  const { __softLanguage, ...rest } = normalized;
  return {
    ...rest,
    authorId: report.authorId ?? DEFAULT_AUTHOR_ID
  };
});
const fallbackEvents = K_CULTURE_EVENTS.map((event) => stripLanguageMeta(ensureLanguage(event)));
const fallbackPhrases = PHRASES.map((phrase) => stripLanguageMeta(ensureLanguage(phrase)));

function toTrend(docData: WithTimestamps<TrendReport>): TrendReport {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return {
    ...rest,
    content: rest.content ?? [],
    tags: rest.tags ?? [],
    publishedAt: rest.publishedAt ?? new Date().toISOString().slice(0, 10),
    authorId: rest.authorId ?? DEFAULT_AUTHOR_ID
  };
}

function toEvent(docData: WithTimestamps<KCultureEvent>): KCultureEvent {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return {
    ...rest,
    longDescription: rest.longDescription ?? [],
    tips: rest.tips ?? []
  };
}

function toPhrase(docData: WithTimestamps<Phrase>): Phrase {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return rest;
}

export async function fetchTrendReports(
  language?: SupportedLanguage
): Promise<TrendReport[]> {
  try {
    const snapshot = await getDocs(
      query(trendCollection, orderBy("publishedAt", "desc"))
    );
    if (snapshot.empty) {
      return sortReports(filterByLanguage(fallbackTrends, language));
    }
    const reports = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<TrendReport>;
      return toTrend({ ...data, id: docSnap.id });
    });
    return sortReports(filterByLanguage(reports, language));
  } catch (error) {
    console.error("Failed to fetch trend reports, fallback to static data.", error);
    return sortReports(filterByLanguage(fallbackTrends, language));
  }
}

export async function getTrendReportById(id: string) {
  try {
    const docRef = doc(trendCollection, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return toTrend({ ...(snapshot.data() as TrendReport), id: snapshot.id });
    }
  } catch (error) {
    console.error("Unable to fetch trend by id", error);
  }
  return fallbackTrends.find((report) => report.id === id) ?? null;
}

export async function addTrendReport(report: TrendReport) {
  const id = report.id;
  const payload: TrendReport & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  } = {
    ...report,
    authorId: report.authorId ?? DEFAULT_AUTHOR_ID,
    language: report.language ?? DEFAULT_LANGUAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(trendCollection, id), payload, { merge: true });
  return fetchTrendReports();
}

export async function updateTrendReport(report: TrendReport) {
  await setDoc(
    doc(trendCollection, report.id),
    {
      ...report,
      authorId: report.authorId ?? DEFAULT_AUTHOR_ID,
      language: report.language ?? DEFAULT_LANGUAGE,
      updatedAt: Timestamp.now()
    },
    { merge: true }
  );
  return fetchTrendReports();
}

export async function deleteTrendReport(id: string) {
  await deleteDoc(doc(trendCollection, id));
  return fetchTrendReports();
}

export async function fetchEvents(
  language?: SupportedLanguage
): Promise<KCultureEvent[]> {
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
  await deleteDoc(doc(eventCollection, id));
  return fetchEvents();
}

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
