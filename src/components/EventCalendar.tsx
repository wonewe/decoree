import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { EventCategory } from "../data/events";
import { useI18n } from "../shared/i18n";
import { EventCardSkeleton } from "./events/EventCardSkeleton";
import { EventEmptyState } from "./events/EventEmptyState";
import { useEventList } from "../hooks/useEventList";
import { BookmarkButton } from "./bookmarks/BookmarkButton";
import { formatDateRange } from "../shared/date";

const CATEGORY_KEYS: EventCategory[] = ["concert", "traditional", "atelier", "theatre", "festival"];

type EventCalendarProps = {
  preview?: boolean;
};

export default function EventCalendar({ preview = false }: EventCalendarProps) {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { status, events, error } = useEventList(language);

  const filteredEvents = useMemo(() => {
    const startFilter = startDate ? new Date(startDate).getTime() : null;
    const endFilter = endDate ? new Date(endDate).getTime() : null;

    return events.filter((event) => {
      if (activeCategory !== "all" && event.category !== activeCategory) {
        return false;
      }
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate || event.startDate).getTime();
      if (startFilter !== null && Number.isFinite(startFilter) && eventEnd < startFilter) {
        return false;
      }
      if (endFilter !== null && Number.isFinite(endFilter) && eventStart > endFilter) {
        return false;
      }
      return true;
    });
  }, [events, activeCategory, startDate, endDate]);

  const previewedEvents = preview ? filteredEvents.slice(0, 4) : filteredEvents;
  const showFilters = !preview;
  const showGrid = status === "success" && previewedEvents.length > 0;
  const showEmpty = status === "success" && previewedEvents.length === 0;
  const showError = status === "error";

  return (
    <section className="section-container space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge-label bg-hanBlue/10 text-hanBlue">{t("events.title")}</span>
          <h2 className="text-3xl font-bold text-dancheongNavy">{t("events.title")}</h2>
          <p className="max-w-2xl text-slate-600">{t("events.subtitle")}</p>
        </div>
        {preview && (
          <Link
            to="/events"
            className="rounded-full border border-hanBlue px-6 py-2.5 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
          >
            {t("eventDetail.backToList")}
          </Link>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <FilterButton
            label={t("events.filter.all")}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {CATEGORY_KEYS.map((category) => (
            <FilterButton
              key={category}
              label={t(`event.eventCategory.${category}`)}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      )}

      {status === "loading" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: preview ? 4 : 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {showFilters && (
        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t("events.dateFilter.title")}
          </div>
          <div className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))_auto]">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              {t("events.dateFilter.start")}
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              {t("events.dateFilter.end")}
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="self-end rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-dancheongRed hover:text-dancheongRed"
            >
              {t("events.dateFilter.reset")}
            </button>
          </div>
        </div>
      )}

      {showGrid && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previewedEvents.map((event) => (
            <article
              key={event.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white text-dancheongNavy shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="h-12 w-12 rounded-full bg-slate-200/50" />
                    <span className="text-sm font-medium">No image</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {t(`event.eventCategory.${event.category}`)}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-hanBlue">
                    {formatDateRange(event.startDate, event.endDate)}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-dancheongNavy group-hover:text-hanBlue transition-colors">
                    {event.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="line-clamp-1 max-w-[60%]">{event.location}</span>
                    <span className="text-dancheongNavy">{event.price}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <Link
                      to={`/events/${event.id}`}
                      className="text-sm font-semibold text-hanBlue transition hover:text-dancheongNavy"
                    >
                      {t("eventDetail.readMore")}
                    </Link>
                    <div className="flex items-center gap-2">
                      {event.bookingUrl && (
                        <a
                          href={event.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-slate-50 p-2 text-slate-400 transition hover:bg-hanBlue hover:text-white"
                          title={t("eventDetail.bookingCta")}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <BookmarkButton
                        size="sm"
                        item={{
                          id: event.id,
                          type: "event",
                          title: event.title,
                          summary: event.description,
                          imageUrl: event.imageUrl,
                          location: event.location,
                          href: `/events/${event.id}`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {showEmpty && (
        <EventEmptyState
          title={t("events.empty")}
          description={t("events.subtitle")}
        />
      )}
      {showError && (
        <EventEmptyState
          title={t("events.error")}
          description={error?.message ?? t("events.subtitle")}
        />
      )}
    </section>
  );
}

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-hanBlue text-white" : "bg-white text-slate-600 hover:text-hanBlue"
        }`}
    >
      {label}
    </button>
  );
}
