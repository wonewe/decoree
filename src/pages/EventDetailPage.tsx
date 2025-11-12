import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { KCultureEvent } from "../data/events";
import { getEventById } from "../services/contentService";
import { useI18n } from "../shared/i18n";
import { formatDateRange } from "../shared/date";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";

type Status = "idle" | "loading" | "success" | "not-found" | "error";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [event, setEvent] = useState<KCultureEvent | null>(null);

  useEffect(() => {
    if (!id) return;
    setStatus("loading");
    getEventById(id)
      .then((data) => {
        if (!data) {
          setStatus("not-found");
          return;
        }
        setEvent(data);
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading" || status === "idle") {
    return (
      <section className="section-container">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
      </section>
    );
  }

  if (status === "not-found" || !event) {
    return (
      <section className="section-container space-y-6 text-center">
        <h2 className="text-3xl font-semibold text-dancheongNavy">
          {t("eventDetail.notFound")}
        </h2>
        <p className="text-slate-600">{t("eventDetail.notFoundSubtitle")}</p>
        <button
          onClick={() => navigate(-1)}
          className="primary-button inline-flex items-center justify-center"
        >
          {t("eventDetail.goBack")}
        </button>
      </section>
    );
  }

  const formattedDate = formatDateRange(event.startDate, event.endDate);
  const bookmarkItem = {
    id: event.id,
    type: "event" as const,
    title: event.title,
    summary: event.description,
    imageUrl: event.imageUrl,
    location: event.location,
    href: `/events/${event.id}`
  };

  return (
    <article className="bg-white">
      <div className="relative h-[320px] w-full overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-6 top-6">
          <BookmarkButton item={bookmarkItem} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-8 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-white/40"
          >
            ← {t("eventDetail.back")}
          </button>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-100">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{event.time}</span>
            <span>•</span>
            <span>{t(`event.eventCategory.${event.category}`)}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{event.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-100 md:text-base">
            {event.description}
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="grid gap-12 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            {event.longDescription.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}

            {event.tips.length > 0 && (
              <div className="rounded-3xl bg-hanBlue/5 p-6">
                <h2 className="text-lg font-semibold text-dancheongNavy">
                  {t("eventDetail.tipsTitle")}
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {event.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 text-hanBlue">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-4 rounded-3xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-dancheongNavy">
              {t("eventDetail.infoTitle")}
            </h2>
            <dl className="space-y-4 text-sm text-slate-600">
              <div>
                <dt className="font-semibold text-slate-500">{t("eventDetail.when")}</dt>
                <dd>{formattedDate}</dd>
                <dd>{event.time}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">{t("eventDetail.where")}</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">{t("eventDetail.price")}</dt>
                <dd>{event.price}</dd>
              </div>
            </dl>
            {event.bookingUrl && (
              <a
                href={event.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="primary-button block text-center"
              >
                {t("eventDetail.bookingCta")}
              </a>
            )}
          </aside>
        </div>

        <div className="mt-12 flex justify-between gap-4">
          <Link to="/events" className="secondary-button">
            {t("eventDetail.backToList")}
          </Link>
          <Link to="/trends" className="primary-button">
            {t("eventDetail.discoverTrends")}
          </Link>
        </div>
      </div>
    </article>
  );
}
