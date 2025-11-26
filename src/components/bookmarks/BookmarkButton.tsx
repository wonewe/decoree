import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookmarks, type BookmarkItem } from "../../shared/bookmarks";
import { useI18n } from "../../shared/i18n";

type BookmarkButtonProps = {
  item: Omit<BookmarkItem, "savedAt">;
  size?: "sm" | "md";
  className?: string;
};

export function BookmarkButton({ item, size = "md", className }: BookmarkButtonProps) {
  const { t } = useI18n();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const location = useLocation();

  const active = isBookmarked(item.type, item.id);

  const sizing =
    size === "sm"
      ? "h-9 w-9 text-xs"
      : "h-10 w-10 text-sm";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const result = toggleBookmark(item);
    if (!result.ok && result.reason === "auth") {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`inline-flex items-center justify-center rounded-full border px-3 py-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-white"
          : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      } ${sizing} ${className ?? ""}`}
      title={active ? t("bookmarks.button.remove") : t("bookmarks.button.save")}
    >
      <BookmarkIcon active={active} />
      <span className="sr-only">
        {active ? t("bookmarks.button.remove") : t("bookmarks.button.save")}
      </span>
    </button>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {active ? (
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="currentColor" />
      ) : (
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      )}
    </svg>
  );
}
