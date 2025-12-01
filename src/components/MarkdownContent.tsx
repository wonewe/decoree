import type { CSSProperties } from "react";
import { sanitizeHtml } from "../utils/sanitizeHtml";

type MarkdownContentProps = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

const normalizeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderInline = (value: string) => {
  let text = escapeHtml(value);
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/`([^`]+?)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  text = text.replace(/!\[([^\]]*?)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" />');
  return text;
};

const stripHtml = (value: string) => normalizeEntities(value).replace(/<[^>]+>/g, "");

const parseHtmlHeading = (value: string) => {
  const match = value.match(/^<h([1-6])[^>]*>([\s\S]+?)<\/h\1>/i);
  if (!match) return null;
  const level = Math.min(parseInt(match[1], 10) || 1, 3);
  const text = stripHtml(match[2]).trim();
  if (!text) return null;
  return { level, text };
};

const parseHtmlImage = (value: string) => {
  const match = value.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']?([^"'>]*)["']?[^>]*>/i);
  if (!match) return null;
  const src = match[1];
  const alt = match[2] ?? "";
  if (!src) return null;
  return { src, alt: escapeHtml(alt) };
};

const renderBlock = (block: string) => {
  const raw = normalizeEntities(block);
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // 1. HTML 블록 태그 감지 (에디터에서 생성된 콘텐츠)
  // 블록 레벨 태그로 시작하면 HTML로 간주하고 그대로 반환
  if (/^<(p|div|h[1-6]|ul|ol|blockquote|pre|figure|hr|table)\b/i.test(trimmed)) {
    return trimmed;
  }

  // 2. 기존 마크다운 처리 로직 (레거시 지원)
  const htmlHeading = parseHtmlHeading(trimmed);
  if (htmlHeading) {
    return `<h${htmlHeading.level}>${renderInline(htmlHeading.text)}</h${htmlHeading.level}>`;
  }

  const htmlImage = parseHtmlImage(trimmed);
  if (htmlImage) {
    return `<p><img src="${htmlImage.src}" alt="${htmlImage.alt}" /></p>`;
  }

  // HTML 태그를 제거하지 않고 인라인 렌더링만 수행
  // (기존에는 stripHtml을 사용했으나, 이제는 인라인 스타일(span)을 허용해야 함)
  // 단, 블록 태그가 아닌 경우 <p>로 감싸야 함
  const processed = renderInline(trimmed);

  if (/^#{1,6}\s/.test(processed)) {
    const level = Math.min(processed.match(/^#+/)![0].length, 3);
    const text = processed.replace(/^#{1,6}\s*/, "");
    return `<h${level}>${text}</h${level}>`;
  }

  if (/^-\s+/m.test(processed)) {
    const items = processed
      .split(/\n+/)
      .filter((line) => line.trim().startsWith("- "))
      .map((line) => `<li>${line.trim().replace(/^-+\s*/, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  return `<p>${processed}</p>`;
};

export function MarkdownContent({ content, className = "", style }: MarkdownContentProps) {
  // 에디터 콘텐츠는 이미 HTML일 수 있으므로, 줄바꿈으로 무조건 나누기보다
  // HTML 태그 구조를 고려해야 하지만, 현재 구조상 split을 유지하되
  // renderBlock에서 HTML을 감지하여 처리
  const blocks = content.split(/\n{2,}/).map(renderBlock).join("");
  const safeHtml = sanitizeHtml(blocks);

  return (
    <div
      className={`prose prose-lg md:prose-xl max-w-[72ch] w-full mx-auto text-[var(--ink)] leading-relaxed tracking-wide
        prose-headings:font-heading prose-headings:text-[var(--ink)] prose-headings:tracking-tight prose-headings:leading-tight prose-headings:font-bold
        prose-p:text-[var(--ink)] prose-p:text-[1.05rem] md:prose-p:text-[1.12rem] prose-p:leading-8 prose-p:mb-8 prose-p:font-normal
        prose-strong:font-bold prose-strong:text-[var(--ink)]
        prose-li:text-[var(--ink)] prose-li:text-[1.05rem] md:prose-li:text-[1.12rem] prose-li:leading-8
        prose-a:text-[var(--ink)] prose-a:font-semibold prose-a:underline prose-a:decoration-[var(--ink-muted)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--ink)]
        [&_img]:mx-auto [&_img]:my-10 [&_img]:block [&_img]:h-auto [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow-lg
        [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:mt-16 [&_h1]:mb-8
        [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:mt-14 [&_h2]:mb-6
        [&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:mt-10 [&_h3]:mb-5
        [&_ul]:my-8 [&_ul]:list-disc [&_ul]:pl-6
        [&_li]:my-3
        [&_hr]:my-10 [&_hr]:border-[var(--border)]
        [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--ink-muted)] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-[var(--ink-muted)] [&_blockquote]:my-10
        [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-[var(--paper-muted)] [&_code]:text-sm [&_code]:font-mono [&_code]:text-[var(--ink)]
        [&_span]:leading-loose
      ${className}`.replace(/\s+/g, " ")}
      style={style}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
