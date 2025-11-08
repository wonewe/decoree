import { useCallback, useMemo } from "react";
import type { KCultureEvent } from "../data/events";
import type { SupportedLanguage } from "../shared/i18n";
import { fetchEvents } from "../services/contentService";
import { useAsyncData } from "./useAsyncData";

export function useEventList(language: SupportedLanguage | undefined) {
  const fetcher = useCallback(() => fetchEvents(language), [language]);
  const { status, data, error } = useAsyncData(fetcher);

  const events = useMemo(() => data ?? [], [data]);

  return {
    status,
    events,
    error,
    hasEvents: events.length > 0
  };
}
