import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { EventCategory } from "../data/events";
import { fetchEvents } from "../services/contentService";
import { useAsyncData } from "../hooks/useAsyncData";
import { useI18n } from "../shared/i18n";

const CATEGORY_KEYS: EventCategory[] = ["concert", "traditional", "pop-up", "festival"];

export default function EventCalendar() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const fetcher = useCallback(() => fetchEvents(), []);
  const { status, data } = useAsyncData(fetcher);

  const filteredEvents = useMemo(() => {
    if (!data) return [];
    return data.filter((event) => activeCategory === "all" || event.category === activeCategory);
  }, [data, activeCategory]);

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
            <div key={index} className="animate-pulse rounded-2xl bg-white p-6 shadow">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "success" && (
        <>
          {filteredEvents.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
              {t("events.empty")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <article key={event.id} className="card space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {new Date(event.date).toLocaleDateString()} · {event.time}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {t(`event.eventCategory.${event.category}`)}
                    </span>
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
        </>
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
