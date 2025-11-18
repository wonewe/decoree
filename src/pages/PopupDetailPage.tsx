import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { PopupEvent } from "../data/popups";
import { getPopupById } from "../services/contentService";
import { useI18n } from "../shared/i18n";
import { BookmarkButton } from "../components/bookmarks/BookmarkButton";

export default function PopupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [popup, setPopup] = useState<PopupEvent | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!id) return;
    getPopupById(id, language)
      .then((data) => {
        if (!data) {
          setStatus("error");
          return;
        }
        setPopup(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [id, language]);

  if (status === "loading") {
    return (
      <section className="section-container">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
      </section>
    );
  }

  if (!popup) {
    return (
      <section className="section-container space-y-4 text-center">
        <h2 className="text-3xl font-semibold text-dancheongNavy">Pop-up not found</h2>
        <button onClick={() => navigate(-1)} className="primary-button inline-flex justify-center">
          {t("trendDetail.goBack")}
        </button>
      </section>
    );
  }

  const bookmarkItem = {
    id: popup.id,
    type: "popup" as const,
    title: popup.title,
    summary: popup.description,
    imageUrl: popup.heroImageUrl,
    location: popup.location,
    href: `/popups/${popup.id}`
  };

  const mapEmbedUrl = popup.location
    ? `https://www.google.com/maps?output=embed&q=${encodeURIComponent(popup.location)}`
    : null;

  const renderDetails = () => (
    <div className="prose prose-slate max-w-none">
      {popup.details.map((paragraph, index) => {
        const isHtml = /<\/?[a-z][^>]*>/i.test(paragraph);
        if (isHtml) {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: paragraph }}
              className="mb-4 [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3"
            />
          );
        }
        return (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        );
      })}
    </div>
  );

  return (
    <article className="bg-white">
      <div className="relative h-[320px] w-full overflow-hidden">
        <img src={popup.heroImageUrl} alt={popup.title} className="h-full w-full object-cover" />
        <div className="absolute right-6 top-6">
          <BookmarkButton item={bookmarkItem} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-1/2 w-full max-w-5xl -translate-x-1/2 px-6 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-white/40"
          >
            ← {t("trendDetail.back")}
          </button>
          <p className="text-sm uppercase tracking-wide text-white/80">{popup.window}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{popup.title}</h1>
          <p className="text-sm text-white/90">{popup.location}</p>
        </div>
      </div>

      <div className="section-container space-y-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <p className="text-lg text-slate-600">{popup.description}</p>
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6 shadow">
              <h2 className="text-xl font-semibold text-dancheongNavy">Highlights</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {popup.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-hanBlue">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {renderDetails()}
          </div>
          <aside className="space-y-4 rounded-3xl bg-white p-6 shadow">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Brand</h3>
              <p className="text-lg font-semibold text-dancheongNavy">{popup.brand}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Status</h3>
              <p className="text-base font-semibold text-hanBlue">
                {popup.status === "now" ? t("popupRadar.status.now") : t("popupRadar.status.soon")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Location</h3>
              <p className="text-sm text-slate-600">{popup.location}</p>
            </div>
            {mapEmbedUrl && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Map</h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    title={`map-${popup.id}`}
                    src={mapEmbedUrl}
                    width="100%"
                    height="220"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="block"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(popup.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-hanBlue hover:underline"
                >
                  지도 크게 보기 ↗
                </a>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {popup.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-hanBlue/10 px-3 py-1 text-xs font-semibold text-hanBlue"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {popup.reservationUrl && (
              <a
                href={popup.reservationUrl}
                target="_blank"
                rel="noreferrer"
                className="primary-button block text-center"
              >
                {t("popupRadar.cards.cta")}
              </a>
            )}
          </aside>
        </div>
        <div className="flex justify-between gap-3">
          <Link to="/popups" className="secondary-button">
            ← {t("trendDetail.backToList")}
          </Link>
          <Link to="/trends" className="primary-button">
            {t("popupRadar.cta.trends")}
          </Link>
        </div>
      </div>
    </article>
  );
}
