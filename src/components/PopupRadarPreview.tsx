import { Link } from "react-router-dom";
import { usePopups } from "../hooks/usePopups";
import { useI18n } from "../shared/i18n";
import { PopupCardSkeleton } from "./popups/PopupCardSkeleton";

export default function PopupRadarPreview() {
  const { t, language } = useI18n();
  const { status, popups } = usePopups(language);
  const activePopups = popups.filter((popup) => popup.status !== "ended");
  const topPopups = activePopups.slice(0, 4);

  return (
    <section className="section-container space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge-label">
            {t("nav.popups")}
          </span>
          <h2 className="font-heading text-3xl text-[var(--ink)] md:text-4xl">{t("popupRadar.title")}</h2>
          <p className="max-w-2xl text-sm text-[var(--ink-muted)] md:text-base">{t("popupRadar.subtitle")}</p>
        </div>
        <Link
          to="/popups"
          className="secondary-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
        >
          {t("popupRadar.cards.cta")}
        </Link>
      </div>

      {status === "success" && topPopups.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topPopups.map((popup) => (
            <Link
              key={popup.id}
              to={`/popups/${popup.id}`}
              className="group overflow-hidden rounded-2xl bg-[var(--paper)] border border-[var(--border)] shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={popup.posterUrl}
                  alt={popup.title}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-xs font-medium mb-1">{popup.window}</div>
                  <h3 className="text-xl font-semibold leading-tight text-white">
                    {popup.title}
                  </h3>
                  <p className="text-sm text-white/90 mt-1">{popup.location}</p>
                </div>
                <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                  {popup.status === "now"
                    ? t("popupRadar.status.now")
                    : popup.status === "soon"
                      ? t("popupRadar.status.soon")
                      : t("popupRadar.status.ended")}
                </span>
              </div>
              <div className="p-4 text-sm text-[var(--ink-muted)]">
                <p className="line-clamp-3 leading-relaxed">{popup.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {status === "success" && topPopups.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-8 text-center text-sm text-[var(--ink-muted)]">
          {t("popupRadar.empty")}
        </p>
      )}

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <PopupCardSkeleton key={idx} />
          ))}
        </div>
      )}
    </section>
  );
}
