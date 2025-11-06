import { K_CULTURE_EVENTS } from "../data/events";
import { PHRASES } from "../data/phrases";
import { TREND_REPORTS } from "../data/trends";

// Simulates Firestore fetch latency to mirror real data access.
const simulateFirestoreFetch = async <T>(data: T, delay = 250): Promise<T> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay)
  );

export async function fetchTrendReports() {
  return simulateFirestoreFetch(TREND_REPORTS);
}

export async function fetchEvents() {
  return simulateFirestoreFetch(K_CULTURE_EVENTS);
}

export async function fetchPhrases() {
  return simulateFirestoreFetch(PHRASES);
}
