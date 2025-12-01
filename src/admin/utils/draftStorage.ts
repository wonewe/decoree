/**
 * LocalStorage를 사용한 Draft 저장/불러오기 유틸리티
 */

export function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn("Failed to read draft", error);
    return null;
  }
}

export function writeDraft<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save draft", error);
  }
}

export function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear draft", error);
  }
}



