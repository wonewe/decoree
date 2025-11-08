import { useCallback, useMemo } from "react";
import type { PopupEvent } from "../data/popups";
import type { SupportedLanguage } from "../shared/i18n";
import { fetchPopups } from "../services/contentService";
import { useAsyncData } from "./useAsyncData";

export function usePopups(language: SupportedLanguage | undefined) {
  const fetcher = useCallback(() => fetchPopups(language), [language]);
  const { status, data, error } = useAsyncData(fetcher);

  const popups = useMemo<PopupEvent[]>(() => data ?? [], [data]);

  return {
    status,
    popups,
    error,
    hasPopups: popups.length > 0
  };
}
