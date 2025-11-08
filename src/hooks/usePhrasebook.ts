import { useCallback, useMemo } from "react";
import type { Phrase } from "../data/phrases";
import type { SupportedLanguage } from "../shared/i18n";
import { fetchPhrases } from "../services/contentService";
import { useAsyncData } from "./useAsyncData";

export function usePhrasebook(language: SupportedLanguage | undefined) {
  const fetcher = useCallback(() => fetchPhrases(language), [language]);
  const { status, data, error } = useAsyncData(fetcher);

  const phrases = useMemo(() => data ?? [], [data]);

  return {
    status,
    phrases,
    error,
    hasPhrases: phrases.length > 0
  };
}
