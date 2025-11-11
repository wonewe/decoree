import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { usePopups } from "../hooks/usePopups";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";

const mapUrl = "https://maps.google.com/?q=Seoul+pop-up";

export default function PopupRadarPage() {
  const { t, language } = useI18n();
  const { status, popups } = usePopups(language);
  const [filter, setFilter] = useState<"all" | "now" | "soon">("all");
  const [search, setSearch] = useState("");

  const filteredPopups = useMemo(() => {
    const list = filter === "all" ? popups : popups.filter((popup) => popup.status === filter);
    const normalized = search.trim().toLowerCase();
    if (!normalized) return list;
    return list.filter((popup) => {
      const haystack = [popup.title, popup.brand, popup.location, popup.description, popup.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [filter, popups, search]);

  const tips = useMemo(
    () => [
      t("popupRadar.sections.tips.items.1"),
      t("popupRadar.sections.tips.items.2"),
      t("popupRadar.sections.tips.items.3")
    ],
    [t]
  );

  return (
    <article className="bg-white">
      <header className="relative overflow-hidden bg-lime-200/50">
        <div className="hero-gradient hero-gradient-1 opacity-30" />
        <div className="hero-gradient hero-gradient-2 opacity-30" />
        <div className="section-container relative space-y-6">
          <span className="badge-label">{t("hero.highlights.popups.title")}</span>
          <h1 className="text-4xl font-bold text-dancheongNavy md:text-5xl">
            {t("popupRadar.title")}
          </h1>
          <p className="max-w-3xl text-lg text-slate-700">{t("popupRadar.subtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="primary-button">
              {t("popupRadar.cta.map")}
            </a>
            <Link to="/trends" className="secondary-button">
              {t("popupRadar.cta.trends")}
            </Link>
          </div>
        </div>
      </header>

      <section className="section-container space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-dancheongNavy">
              {t("popupRadar.sections.now.title")}
            </h2>
            <p className="text-sm text-slate-500">{t("popupRadar.sections.now.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "now", "soon"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === key
                    ? "bg-hanBlue text-white shadow"
                    : "border border-slate-200 text-slate-600 hover:border-hanBlue hover:text-hanBlue"
                }`}
              >
                {t(`popupRadar.filters.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow">
          <label htmlFor="popup-search" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t("popupRadar.search.label")}
          </label>
          <div className="relative">
            <input
              id="popup-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("popupRadar.search.placeholder")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm shadow-inner focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-hanBlue"
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
                className="group flex h-full flex-col rounded-[32px] bg-gradient-to-b from-white via-white to-slate-50 p-3 shadow-xl"
              >
                <Link
                  to={`/popups/${popup.id}`}
                  className="relative overflow-hidden rounded-[24px] bg-slate-100"
                >
                  <img
                    src={popup.posterUrl}
                    alt={popup.title}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <div className="text-xs">{popup.window}</div>
                    <h3 className="text-2xl font-bold">{popup.title}</h3>
                    <p className="text-sm text-white/80">{popup.location}</p>
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                    {popup.status === "now"
                      ? t("popupRadar.status.now")
                      : t("popupRadar.status.soon")}
                  </span>
                </Link>
                <div className="flex flex-1" />
              </article>
            ))}
          </div>
        )}

        {status === "success" && filteredPopups.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            {t("popupRadar.empty")}
          </div>
        )}

        <aside className="space-y-4 rounded-3xl bg-slate-50 p-6 shadow">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {t("popupRadar.sections.tips.title")}
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            {tips.map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-hanBlue">{index + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-dashed border-hanBlue/30 bg-white/80 p-4 text-sm text-slate-500">
            {t("popupRadar.sections.overview.body")}
          </div>
        </aside>
      </section>
    </article>
  );
}
