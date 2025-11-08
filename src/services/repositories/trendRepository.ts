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
import { trendCollection } from "./firestoreClient";
import { TREND_REPORTS, type TrendReport } from "../../data/trends";
import { AUTHOR_PROFILES } from "../../data/authors";
import type { SupportedLanguage } from "../../shared/i18n";
import { DEFAULT_LANGUAGE, ensureLanguage, filterByLanguage } from "./languageUtils";
import { assertFirestoreAvailable, shouldUseStaticContent } from "./runtimeConfig";

const DEFAULT_AUTHOR_ID = AUTHOR_PROFILES[0]?.id ?? "decorée-team";

type WithTimestamps<T> = T & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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

const toTrend = (docData: WithTimestamps<TrendReport>): TrendReport => {
  const normalized = ensureLanguage(docData);
  const { __softLanguage, ...rest } = normalized;
  return {
    ...rest,
    content: rest.content ?? [],
    tags: rest.tags ?? [],
    publishedAt: rest.publishedAt ?? new Date().toISOString().slice(0, 10),
    authorId: rest.authorId ?? DEFAULT_AUTHOR_ID
  };
};

export async function fetchTrendReports(language?: SupportedLanguage): Promise<TrendReport[]> {
  if (shouldUseStaticContent()) {
    return sortReports(filterByLanguage(fallbackTrends, language));
  }
  try {
    const snapshot = await getDocs(query(trendCollection, orderBy("publishedAt", "desc")));
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
  if (shouldUseStaticContent()) {
    return fallbackTrends.find((report) => report.id === id) ?? null;
  }
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
  assertFirestoreAvailable("Adding a trend report");
  const id = report.id;
  const payload: TrendReport & { createdAt: Timestamp; updatedAt: Timestamp } = {
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
  assertFirestoreAvailable("Updating a trend report");
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
  assertFirestoreAvailable("Deleting a trend report");
  await deleteDoc(doc(trendCollection, id));
  return fetchTrendReports();
}
