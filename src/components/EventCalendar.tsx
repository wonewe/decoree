import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { EventCategory } from "../data/events";
import { useI18n } from "../shared/i18n";
import { EventCardSkeleton } from "./events/EventCardSkeleton";
import { EventEmptyState } from "./events/EventEmptyState";
import { useEventList } from "../hooks/useEventList";
import { BookmarkButton } from "./bookmarks/BookmarkButton";

const CATEGORY_KEYS: EventCategory[] = ["concert", "traditional", "pop-up", "festival"];

export default function EventCalendar() {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const { status, events, error } = useEventList(language);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => activeCategory === "all" || event.category === activeCategory);
  }, [events, activeCategory]);

  const showGrid = status === "success" && filteredEvents.length > 0;
  const showEmpty = status === "success" && filteredEvents.length === 0;
  const showError = status === "error";

  return (
    <section className="section-container space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-dancheongNavy">{t("events.title")}</h2>
        <p className="max-w-2xl text-slate-600">{t("events.subtitle")}</p>
      </div>

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

      {status === "loading" && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {showGrid && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <article key={event.id} className="card space-y-4">
              <div className="flex items-start justify-between gap-3 text-sm text-slate-500">
                <div>
                  <span>
                    {new Date(event.date).toLocaleDateString()} · {event.time}
                  </span>
                  <span className="ml-2 inline-flex rounded-full bg-slate-100 px-3 py-1">
                    {t(`event.eventCategory.${event.category}`)}
                  </span>
                </div>
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
              <div>
                <h3 className="text-xl font-semibold text-dancheongNavy">{event.title}</h3>
                <p className="mt-2 text-slate-600">{event.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{event.location}</span>
                <span className="font-semibold text-hanBlue">{event.price}</span>
              </div>
              <Link
                to={`/events/${event.id}`}
                className="inline-flex items-center text-sm font-semibold text-hanBlue hover:underline"
              >
                {t("eventDetail.readMore")} →
              </Link>
              {event.bookingUrl && (
                <a
                  href={event.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-hanBlue hover:underline"
                >
                  {t("eventDetail.bookingCta")}
                </a>
              )}
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
