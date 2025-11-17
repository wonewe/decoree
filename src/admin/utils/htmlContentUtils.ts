/**
 * HTML 콘텐츠 파싱 및 변환 유틸리티
 */

/**
 * HTML 태그가 포함되어 있는지 확인
 */
export function hasHtmlContent(content: string): boolean {
  return content.includes("<img") || content.includes("<p>") || content.includes("<h2>");
}

/**
 * HTML 문자열을 배열로 분리
 */
export function parseHtmlToArray(htmlContent: string): string[] {
  try {
    if (typeof document !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const elements = Array.from(tempDiv.children);
      const parsed = elements.map(el => el.outerHTML).filter(Boolean);
      // 빈 배열이면 원본을 그대로 사용
      return parsed.length > 0 ? parsed : [htmlContent];
    } else {
      // 서버 사이드에서는 원본을 그대로 사용
      return [htmlContent];
    }
  } catch (error) {
    console.warn("HTML 파싱 실패, 원본 사용:", error);
    return [htmlContent];
  }
}

/**
 * 텍스트를 줄바꿈으로 분리하여 배열로 변환
 */
export function parseTextToArray(text: string): string[] {
  return text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * HTML 또는 텍스트 콘텐츠를 배열로 변환
 */
export function parseContentToArray(content: string): string[] {
  if (hasHtmlContent(content)) {
    return parseHtmlToArray(content);
  } else {
    return parseTextToArray(content);
  }
}

/**
 * HTML 배열을 문자열로 합치기
 */
export function joinHtmlArray(htmlArray: string[]): string {
  const hasHtml = htmlArray.some(item => hasHtmlContent(item));
  return hasHtml ? htmlArray.join("") : htmlArray.join("\n\n");
}


