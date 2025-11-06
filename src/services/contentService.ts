import { K_CULTURE_EVENTS, type KCultureEvent } from "../data/events";
import { PHRASES, type Phrase } from "../data/phrases";
import { TREND_REPORTS, type TrendReport } from "../data/trends";

// Simulates Firestore fetch latency to mirror real data access.
const simulateFirestoreFetch = async <T>(data: T, delay = 250): Promise<T> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay)
  );

const STORAGE_KEYS = {
  trends: "decoree.trends.custom",
  events: "decoree.events.custom",
  phrases: "decoree.phrases.custom"
} as const;

function readStored<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch (error) {
    console.warn("Failed to read stored content", error);
    return [];
  }
}

function writeStored<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to persist custom content", error);
  }
}

export async function fetchTrendReports() {
  const stored = readStored<TrendReport>(STORAGE_KEYS.trends);
  return simulateFirestoreFetch([...TREND_REPORTS, ...stored]);
}

export async function getTrendReportById(id: string) {
  const reports = await fetchTrendReports();
  return reports.find((report) => report.id === id) ?? null;
}

export async function addTrendReport(report: TrendReport) {
  const stored = readStored<TrendReport>(STORAGE_KEYS.trends);
  const next = [...stored, report];
  writeStored(STORAGE_KEYS.trends, next);
  return fetchTrendReports();
}

export async function fetchEvents() {
  const stored = readStored<KCultureEvent>(STORAGE_KEYS.events);
  return simulateFirestoreFetch([...K_CULTURE_EVENTS, ...stored]);
}

export async function getEventById(id: string) {
  const events = await fetchEvents();
  return events.find((event) => event.id === id) ?? null;
}

export async function addEvent(event: KCultureEvent) {
  const stored = readStored<KCultureEvent>(STORAGE_KEYS.events);
  const next = [...stored, event];
  writeStored(STORAGE_KEYS.events, next);
  return fetchEvents();
}

export async function fetchPhrases() {
  const stored = readStored<Phrase>(STORAGE_KEYS.phrases);
  return simulateFirestoreFetch([...PHRASES, ...stored]);
}

export async function addPhrase(phrase: Phrase) {
  const stored = readStored<Phrase>(STORAGE_KEYS.phrases);
  const next = [...stored, phrase];
  writeStored(STORAGE_KEYS.phrases, next);
  return fetchPhrases();
}

export function clearCustomContent() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
