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

const filterHidden = (reports: TrendReport[], includeHidden?: boolean) =>
  includeHidden ? reports : reports.filter((report) => !report.hidden);

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

export async function fetchTrendReports(
  language?: SupportedLanguage,
  options?: { includeHidden?: boolean }
): Promise<TrendReport[]> {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    return sortReports(filterHidden(filterByLanguage(fallbackTrends, language), includeHidden));
  }
  try {
    const snapshot = await getDocs(query(trendCollection, orderBy("publishedAt", "desc")));
    if (snapshot.empty) {
      return sortReports(filterHidden(filterByLanguage(fallbackTrends, language), includeHidden));
    }
    const reports = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as WithTimestamps<TrendReport>;
      return toTrend({ ...data, id: docSnap.id });
    });
    return sortReports(filterHidden(filterByLanguage(reports, language), includeHidden));
  } catch (error) {
    console.error("Failed to fetch trend reports, fallback to static data.", error);
    return sortReports(filterHidden(filterByLanguage(fallbackTrends, language), includeHidden));
  }
}

export async function getTrendReportById(id: string, options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;
  if (shouldUseStaticContent()) {
    const found = fallbackTrends.find((report) => report.id === id);
    if (found && !includeHidden && found.hidden) return null;
    return found ?? null;
  }
  try {
    const docRef = doc(trendCollection, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const report = toTrend({ ...(snapshot.data() as TrendReport), id: snapshot.id });
      if (!includeHidden && report.hidden) return null;
      return report;
    }
  } catch (error) {
    console.error("Unable to fetch trend by id", error);
  }
  const fallback = fallbackTrends.find((report) => report.id === id);
  if (fallback && !includeHidden && fallback.hidden) return null;
  return fallback ?? null;
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
  return fetchTrendReports(undefined, { includeHidden: true });
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
  return fetchTrendReports(undefined, { includeHidden: true });
}

export async function deleteTrendReport(id: string) {
  assertFirestoreAvailable("Deleting a trend report");
  await deleteDoc(doc(trendCollection, id));
  return fetchTrendReports(undefined, { includeHidden: true });
}
