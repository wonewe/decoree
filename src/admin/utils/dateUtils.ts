/**
 * 날짜 관련 유틸리티 함수
 */

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}



