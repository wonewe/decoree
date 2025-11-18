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
    <section className="section-container space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <span className="badge-label bg-hanBlue/10 text-hanBlue">{t("events.title")}</span>
          <h2 className="text-3xl font-bold text-dancheongNavy">{t("events.title")}</h2>
          <p className="max-w-2xl text-slate-600">{t("events.subtitle")}</p>
        </div>
        {preview && (
          <Link
            to="/events"
            className="rounded-full border border-hanBlue px-4 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
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
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: preview ? 4 : 2 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {showFilters && (
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow">
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
              className="self-end rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-dancheongRed hover:text-dancheongRed"
            >
              {t("events.dateFilter.reset")}
            </button>
          </div>
        </div>
      )}

      {showGrid && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {previewedEvents.map((event) => (
            <article
              key={event.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white text-dancheongNavy shadow-lg ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1"
            >
              {event.imageUrl && (
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
                </div>
              )}
              <div className="flex h-full flex-col justify-end gap-3 p-5">
                <div className="flex items-start justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>
                    {formatDateRange(event.startDate, event.endDate)} · {event.time}
                  </span>
                  <span>{t(`event.eventCategory.${event.category}`)}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-dancheongNavy">{event.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                </div>
                <div className="flex flex-col gap-1 text-sm text-slate-600">
                  <span className="line-clamp-1">{event.location}</span>
                  <span className="font-semibold text-dancheongNavy">{event.price}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <Link to={`/events/${event.id}`} className="text-hanBlue hover:underline">
                    {t("eventDetail.readMore")} →
                  </Link>
                  {event.bookingUrl && (
                    <a
                      href={event.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-hanBlue"
                    >
                      {t("eventDetail.bookingCta")}
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
        active ? "bg-hanBlue text-white" : "bg-white text-slate-600 hover:text-hanBlue"
      }`}
    >
      {label}
    </button>
  );
}
