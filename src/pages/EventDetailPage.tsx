import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
        <div className="h-72 animate-pulse rounded-3xl bg-[var(--paper)] shadow-sm ring-1 ring-[var(--border)]" />
      </section>
    );
  }

  if (status === "not-found" || !event) {
    return (
      <section className="section-container space-y-6 text-center">
        <h2 className="text-3xl font-semibold text-[var(--ink)]">
          {t("eventDetail.notFound")}
        </h2>
        <p className="text-[var(--ink-muted)]">{t("eventDetail.notFoundSubtitle")}</p>
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
  const mapQuery = (event.mapQuery && event.mapQuery.trim()) || event.location;
  const mapEmbedUrl = mapQuery
    ? `https://www.google.com/maps?output=embed&q=${encodeURIComponent(mapQuery)}`
    : null;
  const mapLink = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null;

  return (
    <article className="bg-[var(--paper)]">
      <Helmet>
        <title>{event.title} | koraid</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content={event.imageUrl} />
        <meta property="og:type" content="event" />
      </Helmet>
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
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/80">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{event.time}</span>
            <span>•</span>
            <span>{t(`event.eventCategory.${event.category}`)}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{event.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85 md:text-base">
            {event.description}
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="grid gap-12 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            {event.longDescription.map((paragraph, index) => {
              // HTML 태그가 포함되어 있으면 HTML로 렌더링
              const isHtml = /<[^>]+>/.test(paragraph);
              if (isHtml) {
                const safeHtml = sanitizeHtml(paragraph);
                return (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: safeHtml }}
                    className="mb-4 text-[1.08rem] leading-relaxed text-[var(--ink)] [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 md:text-[1.16rem]"
                  />
                );
              }
              // 일반 텍스트인 경우
              return (
                <p key={index} className="mb-4 text-[1.08rem] leading-relaxed text-[var(--ink)]">
                  {paragraph}
                </p>
              );
            })}

            {event.tips.length > 0 && (
              <div className="rounded-3xl bg-[var(--paper-muted)] p-6">
                <h2 className="text-lg font-semibold text-[var(--ink)]">
                  {t("eventDetail.tipsTitle")}
                </h2>
                <ul className="mt-3 space-y-2 text-base leading-relaxed text-[var(--ink)]">
                  {event.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 text-[var(--ink)]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-4 rounded-3xl bg-[var(--paper-muted)] p-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              {t("eventDetail.infoTitle")}
            </h2>
            <dl className="space-y-4 text-base leading-relaxed text-[var(--ink)]">
              <div>
                <dt className="font-semibold text-[var(--ink-subtle)]">{t("eventDetail.when")}</dt>
                <dd>{formattedDate}</dd>
                <dd>{event.time}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--ink-subtle)]">{t("eventDetail.where")}</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--ink-subtle)]">{t("eventDetail.price")}</dt>
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
            {mapEmbedUrl && (
              <div className="mt-4 space-y-2">
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm">
                  <iframe
                    title={`${event.title} map`}
                    src={mapEmbedUrl}
                    className="h-56 w-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div className="text-xs text-[var(--ink-subtle)]">
                  <span className="font-semibold text-[var(--ink)]">Map:</span>{" "}
                  {mapQuery}
                  {mapLink && (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--ink)] underline-offset-4 hover:underline"
                      >
                        Google Maps에서 열기
                      </a>
                    </>
                  )}
                </div>
              </div>
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
