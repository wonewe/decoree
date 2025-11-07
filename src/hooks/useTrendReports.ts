import { useCallback, useMemo } from "react";
import type { TrendReport } from "../data/trends";
import type { SupportedLanguage } from "../shared/i18n";
import { fetchTrendReports } from "../services/contentService";
import { useAsyncData } from "./useAsyncData";

const sortByPublishedDate = (reports: TrendReport[]) =>
  [...reports].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

export function useTrendReports(language: SupportedLanguage | undefined) {
  const fetcher = useCallback(() => fetchTrendReports(language), [language]);
  const { status, data, error } = useAsyncData(fetcher);

  const reports = useMemo(() => {
    if (!data) return [];
    return sortByPublishedDate(data);
  }, [data]);

  return {
    status,
    reports,
    error,
    hasReports: reports.length > 0
  };
}
