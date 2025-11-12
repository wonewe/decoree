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
import {
  DEFAULT_LANGUAGE,
  ensureLanguage,
  filterByLanguage,
  stripLanguageMeta
} from "./languageUtils";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const fallbackEvents = K_CULTURE_EVENTS.map((event) => normalizeEvent(event));
const fallbackEventIds = new Set(fallbackEvents.map((event) => event.id));

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const LOCAL_EVENT_OVERRIDES_KEY = "koraid:events:overrides";
const LOCAL_EVENT_DELETED_KEY = "koraid:events:deleted";

function readLocalOverrides(): KCultureEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_EVENT_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as KCultureEvent[]) : [];
  } catch (error) {
    console.warn("Failed to read local event overrides", error);
    return [];
  }
}

function writeLocalOverrides(events: KCultureEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_EVENT_OVERRIDES_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn("Failed to persist local event overrides", error);
  }
}

function readDeletedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_EVENT_DELETED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch (error) {
    console.warn("Failed to read deleted event ids", error);
    return [];
  }
}

function writeDeletedIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_EVENT_DELETED_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn("Failed to persist deleted event ids", error);
  }
}

function normalizeEvent(event: KCultureEvent) {
  const normalized = stripLanguageMeta(ensureLanguage(event));
  return {
    ...normalized,
    startDate: normalized.startDate ?? normalized.endDate ?? todayIso(),
    endDate: normalized.endDate ?? normalized.startDate ?? todayIso()
  };
}

function sortEvents(events: KCultureEvent[]) {
  return [...events].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

function mergeStaticEvents(language?: SupportedLanguage) {
  const overrides = readLocalOverrides().map(normalizeEvent);
  const deletedIds = new Set(readDeletedIds());
  const overrideMap = new Map(overrides.map((event) => [event.id, event]));

  const baseEvents = fallbackEvents
    .filter((event) => !deletedIds.has(event.id))
    .map((event) => overrideMap.get(event.id) ?? event);

  const extraEvents = overrides.filter((event) => !fallbackEventIds.has(event.id));
  const merged = [...baseEvents, ...extraEvents];
  return sortEvents(filterByLanguage(merged, language));
}

function upsertLocalEvent(event: KCultureEvent) {
  const overrides = readLocalOverrides();
  const normalized = normalizeEvent(event);
  const index = overrides.findIndex((item) => item.id === normalized.id);
  if (index >= 0) {
    overrides[index] = normalized;
  } else {
    overrides.push(normalized);
  }
  writeLocalOverrides(overrides);

  const deleted = new Set(readDeletedIds());
  deleted.delete(normalized.id);
  writeDeletedIds([...deleted]);
}

function markEventDeleted(id: string) {
  const overrides = readLocalOverrides().filter((event) => event.id !== id);
  writeLocalOverrides(overrides);

  const deleted = new Set(readDeletedIds());
  if (fallbackEventIds.has(id)) {
    deleted.add(id);
  } else {
    deleted.delete(id);
  }
  writeDeletedIds([...deleted]);
}

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
    return mergeStaticEvents(language);
  }
  try {
    const snapshot = await getDocs(query(eventCollection, orderBy("startDate", "asc")));
    if (snapshot.empty) {
      return mergeStaticEvents(language);
    }
    const events = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<KCultureEvent>;
      return toEvent({ ...data, id: docSnap.id });
    });
    return sortEvents(filterByLanguage(events, language));
  } catch (error) {
    console.error("Failed to fetch events, fallback to static data.", error);
    return mergeStaticEvents(language);
  }
}

export async function getEventById(id: string) {
  if (shouldUseStaticContent()) {
    const overrides = readLocalOverrides();
    const deletedIds = new Set(readDeletedIds());
    if (deletedIds.has(id)) return null;
    const override = overrides.find((event) => event.id === id);
    if (override) return normalizeEvent(override);
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
  if (shouldUseStaticContent()) {
    upsertLocalEvent(event);
    return mergeStaticEvents();
  }
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
  if (shouldUseStaticContent()) {
    upsertLocalEvent(event);
    return mergeStaticEvents();
  }
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
  if (shouldUseStaticContent()) {
    markEventDeleted(id);
    return mergeStaticEvents();
  }
  assertFirestoreAvailable("Deleting an event");
  await deleteDoc(doc(eventCollection, id));
  return fetchEvents();
}
