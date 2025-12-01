import type { SupportedLanguage } from "../shared/i18n";

export const LANG_OPTIONS: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

export const DRAFT_STORAGE_KEYS = {
  trend: "koraid:studio:draft:trend",
  event: "koraid:studio:draft:event",
  phrase: "koraid:studio:draft:phrase",
  popup: "koraid:studio:draft:popup"
} as const;



