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
import { shouldUseStaticContent } from "./runtimeConfig";

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

function filterHidden(events: KCultureEvent[], includeHidden?: boolean) {
  return includeHidden ? events : events.filter((event) => !event.hidden);
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

function getLocalEventById(id: string): KCultureEvent | null {
  const overrides = readLocalOverrides();
  const deletedIds = new Set(readDeletedIds());
  if (deletedIds.has(id)) return null;
  const override = overrides.find((event) => event.id === id);
  if (override) return normalizeEvent(override);
  return fallbackEvents.find((event) => event.id === id) ?? null;
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

export async function fetchEvents(
  language?: SupportedLanguage,
  options?: { includeHidden?: boolean }
): Promise<KCultureEvent[]> {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    return filterHidden(mergeStaticEvents(language), includeHidden);
  }
  try {
    const snapshot = await getDocs(query(eventCollection, orderBy("startDate", "asc")));
    if (snapshot.empty) {
      return filterHidden(mergeStaticEvents(language), includeHidden);
    }
    const events = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<KCultureEvent>;
      return toEvent({ ...data, id: docSnap.id });
    });
    return sortEvents(filterHidden(filterByLanguage(events, language), includeHidden));
  } catch (error) {
    console.error("Failed to fetch events, fallback to static data.", error);
    return filterHidden(mergeStaticEvents(language), includeHidden);
  }
}

export async function getEventById(id: string, options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    const local = getLocalEventById(id);
    if (local && !includeHidden && local.hidden) return null;
    return local;
  }
  try {
    const snapshot = await getDoc(doc(eventCollection, id));
    if (snapshot.exists()) {
      const data = toEvent({ ...(snapshot.data() as KCultureEvent), id: snapshot.id });
      if (!includeHidden && data.hidden) return null;
      return data;
    }
  } catch (error) {
    console.error("Unable to fetch event by id", error);
    const fallback = getLocalEventById(id);
    if (fallback && !includeHidden && fallback.hidden) return null;
    return fallback;
  }
  const fallback = getLocalEventById(id);
  if (fallback && !includeHidden && fallback.hidden) return null;
  return fallback;
}

export async function addEvent(event: KCultureEvent) {
  const saveLocally = () => {
    upsertLocalEvent(event);
    return mergeStaticEvents();
  };

  if (shouldUseStaticContent()) {
    return saveLocally();
  }

  try {
    const id = event.id;
    console.log("[events] addEvent: 저장할 이벤트 ID:", id, "제목:", event.title);
    const payload: KCultureEvent & { createdAt: Timestamp; updatedAt: Timestamp } = {
      ...event,
      language: event.language ?? DEFAULT_LANGUAGE,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    await setDoc(doc(eventCollection, id), payload, { merge: true });
    const fetched = await fetchEvents(undefined, { includeHidden: true });
    console.log("[events] addEvent: 저장 후 이벤트 개수:", fetched.length, "ID 목록:", fetched.map(e => e.id));
    return fetched;
  } catch (error) {
    console.warn("[events] addEvent failed on Firestore, falling back to local store.", error);
    return saveLocally();
  }
}

export async function updateEvent(event: KCultureEvent) {
  const saveLocally = () => {
    upsertLocalEvent(event);
    return mergeStaticEvents();
  };

  if (shouldUseStaticContent()) {
    return saveLocally();
  }

  try {
    await setDoc(
      doc(eventCollection, event.id),
      {
        ...event,
        language: event.language ?? DEFAULT_LANGUAGE,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
    return fetchEvents(undefined, { includeHidden: true });
  } catch (error) {
    console.warn("[events] updateEvent failed on Firestore, falling back to local store.", error);
    return saveLocally();
  }
}

export async function deleteEvent(id: string) {
  const deleteLocally = () => {
    markEventDeleted(id);
    return mergeStaticEvents();
  };

  if (shouldUseStaticContent()) {
    return deleteLocally();
  }

  try {
    await deleteDoc(doc(eventCollection, id));
    return fetchEvents(undefined, { includeHidden: true });
  } catch (error) {
    console.warn("[events] deleteEvent failed on Firestore, falling back to local store.", error);
    return deleteLocally();
  }
}
