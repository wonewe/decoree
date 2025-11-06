import {
  collection,
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

const sortReports = (reports: TrendReport[]) =>
  [...reports].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

const fallbackTrends = sortReports(TREND_REPORTS);
const fallbackEvents = K_CULTURE_EVENTS;
const fallbackPhrases = PHRASES;

function toTrend(docData: WithTimestamps<TrendReport>): TrendReport {
  return {
    ...docData,
    content: docData.content ?? [],
    tags: docData.tags ?? [],
    publishedAt: docData.publishedAt ?? new Date().toISOString().slice(0, 10)
  };
}

function toEvent(docData: WithTimestamps<KCultureEvent>): KCultureEvent {
  return {
    ...docData,
    longDescription: docData.longDescription ?? [],
    tips: docData.tips ?? []
  };
}

export async function fetchTrendReports(): Promise<TrendReport[]> {
  try {
    const snapshot = await getDocs(
      query(trendCollection, orderBy("publishedAt", "desc"))
    );
    if (snapshot.empty) {
      return fallbackTrends;
    }
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<TrendReport>;
      return toTrend({ ...data, id: docSnap.id });
    });
  } catch (error) {
    console.error("Failed to fetch trend reports, fallback to static data.", error);
    return fallbackTrends;
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(trendCollection, id), payload, { merge: true });
  return fetchTrendReports();
}

export async function fetchEvents(): Promise<KCultureEvent[]> {
  try {
    const snapshot = await getDocs(query(eventCollection, orderBy("date", "asc")));
    if (snapshot.empty) {
      return fallbackEvents;
    }
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<KCultureEvent>;
      return toEvent({ ...data, id: docSnap.id });
    });
  } catch (error) {
    console.error("Failed to fetch events, fallback to static data.", error);
    return fallbackEvents;
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(eventCollection, id), payload, { merge: true });
  return fetchEvents();
}

export async function fetchPhrases(): Promise<Phrase[]> {
  try {
    const snapshot = await getDocs(phraseCollection);
    if (snapshot.empty) {
      return fallbackPhrases;
    }
    return snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Phrase),
      id: docSnap.id
    }));
  } catch (error) {
    console.error("Failed to fetch phrases, fallback to static data.", error);
    return fallbackPhrases;
  }
}

export async function addPhrase(phrase: Phrase) {
  const id = phrase.id;
  const payload: Phrase & { createdAt: Timestamp; updatedAt: Timestamp } = {
    ...phrase,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(doc(phraseCollection, id), payload, { merge: true });
  return fetchPhrases();
}
