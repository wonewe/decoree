import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { usePopups } from "../hooks/usePopups";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";

export default function PopupRadarPage() {
  const { t, language } = useI18n();
  const { status, popups } = usePopups(language);
  const [filter, setFilter] = useState<"all" | "now" | "soon" | "ended">("all");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | "all">("all");

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    popups.forEach((popup) => {
      popup.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [popups]);

  const filteredPopups = useMemo(() => {
    const list = filter === "all" ? popups : popups.filter((popup) => popup.status === filter);
    const normalized = search.trim().toLowerCase();
    const searched = !normalized
      ? list
      : list.filter((popup) => {
          const haystack = [
            popup.title,
            popup.brand,
            popup.location,
            popup.description,
            popup.tags.join(" ")
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalized);
        });

    const byTag =
      activeTag === "all" ? searched : searched.filter((popup) => popup.tags.includes(activeTag));

    // 전체 보기(all)에서는 ended 상태를 항상 리스트 하단으로 정렬
    if (filter === "all") {
      const statusOrder: Record<string, number> = { now: 0, soon: 1, ended: 2 };
      return [...byTag].sort((a, b) => {
        return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
      });
    }

    return byTag;
  }, [activeTag, filter, popups, search]);

  return (
    <section className="section-container space-y-10">
      <div className="content-shell space-y-4">
        <span className="badge-label">{t("popupRadar.title")}</span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-4xl text-[var(--ink)]">
              {t("popupRadar.sections.now.title")}
            </h2>
            <p className="text-[var(--ink-muted)]">{t("popupRadar.sections.now.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "now", "soon", "ended"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === key
                    ? "bg-[var(--ink)] text-white"
                    : "bg-white text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t(`popupRadar.filters.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTag === "all"
                ? "bg-[var(--ink)] text-white"
                : "bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t("popupRadar.filters.allTags", { defaultValue: "All tags" })}
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTag === tag
                  ? "bg-[var(--ink)] text-white"
                  : "bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="card space-y-3">
        <label
          htmlFor="popup-search"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]"
        >
          {t("popupRadar.search.label")}
        </label>
        <div className="relative">
          <input
            id="popup-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("popupRadar.search.placeholder")}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 pr-12 text-sm focus:border-[var(--ink)] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-[var(--ink)]"
            >
              {t("popupRadar.search.clear")}
            </button>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[32px] bg-white p-6 shadow">
              <div className="h-64 rounded-2xl bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {status === "success" && filteredPopups.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPopups.map((popup) => (
            <article
              key={popup.id}
              className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-[var(--paper)] shadow-xl ring-1 ring-[var(--border)]"
            >
              <div className="relative overflow-hidden">
                <Link to={`/popups/${popup.id}`} className="block">
                  <img
                    src={popup.posterUrl}
                    alt={popup.title}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="text-xs">{popup.window}</div>
                    <h3 className="text-2xl font-bold leading-tight text-white drop-shadow">{popup.title}</h3>
                    <p className="text-sm text-white/80">{popup.location}</p>
                  </div>
                </Link>
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                    popup.status === "ended" ? "bg-slate-700/80 text-white" : "bg-black/70 text-white"
                  }`}
                >
                  {popup.status === "now"
                    ? t("popupRadar.status.now")
                    : popup.status === "soon"
                      ? t("popupRadar.status.soon")
                      : t("popupRadar.status.ended")}
                </span>
                <div className="absolute right-3 top-3">
                  <BookmarkButton
                    size="sm"
                    item={{
                      id: popup.id,
                      type: "popup",
                      title: popup.title,
                      summary: popup.description,
                      imageUrl: popup.posterUrl,
                      location: popup.location,
                      href: `/popups/${popup.id}`
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-5 text-[var(--ink)]">
                <p className="text-sm text-[var(--ink-muted)] line-clamp-2">{popup.description}</p>
                <p className="text-xs text-[var(--ink-subtle)]">{popup.location}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {status === "success" && filteredPopups.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--ink-muted)]">
          {t("popupRadar.empty")}
        </div>
      )}
    </section>
  );
}
