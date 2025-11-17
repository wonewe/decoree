import type { SupportedLanguage } from "../../shared/i18n";

/**
 * 언어 관련 유틸리티 함수
 */

/**
 * 선택된 언어 목록을 해결 (빈 배열이면 기본 언어만 반환)
 */
export function resolveTargetLanguages(
  selected: SupportedLanguage[] | undefined,
  baseLanguage: SupportedLanguage
): SupportedLanguage[] {
  const fallback = selected && selected.length > 0 ? selected : [baseLanguage];
  return Array.from(new Set(fallback));
}

/**
 * ID에서 언어 접두사 제거
 */
export function normalizeBaseId(id: string, baseLanguage: SupportedLanguage): string {
  const prefix = `${baseLanguage}-`;
  if (id.startsWith(prefix)) {
    return id.slice(prefix.length);
  }
  return id;
}

/**
 * 다국어 ID 생성
 */
export function buildLocalizedId(
  baseId: string,
  baseLanguage: SupportedLanguage,
  language: SupportedLanguage,
  totalLanguages: number
): string {
  if (totalLanguages <= 1) {
    return baseId.trim();
  }
  const canonical = normalizeBaseId(baseId.trim(), baseLanguage) || baseId.trim();
  return `${language}-${canonical}`;
}

/**
 * 소스 언어 변경 시 언어 목록 동기화
 */
export function syncLanguagesOnSourceChange(
  languages: SupportedLanguage[] | undefined,
  nextLanguage: SupportedLanguage
): SupportedLanguage[] {
  if (!languages || languages.length === 0) return [nextLanguage];
  if (languages.length === 1) return [nextLanguage];
  return languages;
}


