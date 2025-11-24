import type { CSSProperties } from "react";

type MarkdownContentProps = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

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

const renderBlock = (block: string) => {
  const trimmed = block.trim();
  if (!trimmed) return "";

  if (/^#{1,6}\s/.test(trimmed)) {
    const level = Math.min(trimmed.match(/^#+/)![0].length, 3); // cap at h3 to keep hierarchy tidy
    const text = trimmed.replace(/^#{1,6}\s*/, "");
    return `<h${level}>${renderInline(text)}</h${level}>`;
  }

  if (/^-\s+/m.test(trimmed)) {
    const items = trimmed
      .split(/\n+/)
      .filter((line) => line.trim().startsWith("- "))
      .map((line) => `<li>${renderInline(line.trim().replace(/^-+\s*/, ""))}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  return `<p>${renderInline(trimmed)}</p>`;
};

export function MarkdownContent({ content, className = "", style }: MarkdownContentProps) {
  const blocks = content.split(/\n{2,}/).map(renderBlock).join("");

  return (
    <div
      className={`prose prose-lg md:prose-xl prose-slate max-w-4xl text-slate-700 leading-relaxed
        [&_img]:mx-auto [&_img]:my-4 [&_img]:block [&_img]:h-auto [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:object-contain [&_img]:shadow-md [&_img]:resize [&_img]:overflow-auto [&_img]:cursor-nwse-resize
        [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h3]:text-xl [&_h3]:md:text-2xl
        [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:my-3 [&_ul]:my-3 [&_li]:my-1 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:text-sm [&_a]:text-hanBlue [&_a]:font-semibold [&_a]:underline
      ${className}`.replace(/\s+/g, " ")}
      style={style}
      dangerouslySetInnerHTML={{ __html: blocks }}
    />
  );
}
