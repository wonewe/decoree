import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    <section className="section-container space-y-10">
      <div className="content-shell flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <span className="badge-label">{t("events.title")}</span>
          <h2 className="font-heading text-4xl text-[var(--ink)]">{t("events.title")}</h2>
          <p className="max-w-2xl text-[var(--ink-muted)]">{t("events.subtitle")}</p>
        </div>
        {preview && (
          <Link to="/events" className="secondary-button">
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
        <div className="space-y-3 rounded-3xl bg-[var(--paper)] p-6 shadow-sm ring-1 ring-[var(--border)]">
          <div className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
            {t("events.dateFilter.title")}
          </div>
          <div className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))_auto]">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              {t("events.dateFilter.start")}
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              {t("events.dateFilter.end")}
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="self-end rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
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
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/events/${event.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/events/${event.id}`);
                }
              }}
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-[var(--paper)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--paper-muted)]">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--ink-subtle)]">
                    <div className="h-12 w-12 rounded-full bg-[var(--paper-muted)]/70" />
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
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
                    {formatDateRange(event.startDate, event.endDate)}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--ink-muted)]">
                    {event.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-subtle)]">
                      <span className="line-clamp-1 max-w-[60%]">{event.location}</span>
                    <span className="text-[var(--ink)]">{event.price}</span>
                  </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                      <div className="flex items-center gap-2">
                      {event.bookingUrl && (
                        <a
                          href={event.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[var(--paper-muted)] p-2 text-[var(--ink-subtle)] transition hover:bg-[var(--ink)] hover:text-white"
                          title={t("eventDetail.bookingCta")}
                            onClick={(e) => e.stopPropagation()}
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
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[var(--ink)] text-white"
          : "bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}
