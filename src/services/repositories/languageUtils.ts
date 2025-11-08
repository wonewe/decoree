import type { SupportedLanguage } from "../../shared/i18n";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
const LANGUAGE_PREFIXES: SupportedLanguage[] = ["en", "fr", "ko", "ja"];

export type WithLanguageMeta<T> = T & {
  language: SupportedLanguage;
  __softLanguage?: boolean;
};

export const inferLanguageFromId = (id: string | undefined): SupportedLanguage | undefined => {
  if (!id) return undefined;
  const prefix = id.split("-")[0] as SupportedLanguage;
  return LANGUAGE_PREFIXES.includes(prefix) ? prefix : undefined;
};

export const ensureLanguage = <T extends { language?: SupportedLanguage; id?: string }>(
  item: T
): WithLanguageMeta<T> => {
  const inferred = inferLanguageFromId(item.id);
  const hasExplicitLanguage = item.language != null;
  const language = item.language ?? inferred ?? DEFAULT_LANGUAGE;
  return {
    ...item,
    language,
    __softLanguage: !hasExplicitLanguage && !inferred
  } as WithLanguageMeta<T>;
};

export const stripLanguageMeta = <T extends WithLanguageMeta<unknown>>(item: T) => {
  const { __softLanguage, ...rest } = item;
  return rest as Omit<T, "__softLanguage">;
};

export const filterByLanguage = <T extends { language?: SupportedLanguage; id?: string }>(
  items: T[],
  language?: SupportedLanguage
) => {
  const normalized = items.map(ensureLanguage);
  if (!language) {
    return normalized.map(stripLanguageMeta);
  }
  return normalized
    .filter((item) => item.language === language || item.__softLanguage)
    .map(stripLanguageMeta);
};
