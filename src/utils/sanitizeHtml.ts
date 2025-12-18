import DOMPurify from "dompurify";

/**
 * dangerouslySetInnerHTML에 넘기기 전에 HTML을 정제(sanitize)하는 유틸입니다.
 * - 브라우저 환경에서만 동작하도록 window 유무를 체크합니다.
 * - null/undefined 입력에 대해서는 안전하게 빈 문자열을 반환합니다.
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";

  if (typeof window === "undefined") {
    // SSR 환경 등에서는 그대로 반환 (렌더링 단계에서만 DOMPurify 사용)
    return input;
  }

  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true }
  });
}


