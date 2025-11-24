import { Link } from "react-router-dom";
import { usePopups } from "../hooks/usePopups";
import { useI18n } from "../shared/i18n";
import { PopupCardSkeleton } from "./popups/PopupCardSkeleton";

export default function PopupRadarPreview() {
  const { t, language } = useI18n();
  const { status, popups } = usePopups(language);
  const topPopups = popups.slice(0, 4);

  return (
    <section className="section-container space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge-label">
            {t("nav.popups")}
          </span>
          <h2 className="text-3xl font-bold text-[var(--ink)]">{t("popupRadar.title")}</h2>
          <p className="max-w-2xl text-[var(--ink-muted)]">{t("popupRadar.subtitle")}</p>
        </div>
        <Link
          to="/popups"
          className="rounded-full border border-[var(--ink)] px-6 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
        >
          {t("popupRadar.cards.cta")}
        </Link>
      </div>

      {status === "success" && topPopups.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topPopups.map((popup) => (
            <Link
              key={popup.id}
              to={`/popups/${popup.id}`}
              className="group overflow-hidden rounded-[32px] bg-[var(--paper)] shadow-lg ring-1 ring-[var(--border)] transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={popup.posterUrl}
                  alt={popup.title}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-xs">{popup.window}</div>
                  <h3 className="text-2xl font-bold leading-tight text-white drop-shadow">
                    {popup.title}
                  </h3>
                  <p className="text-sm text-white/80">{popup.location}</p>
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
                  {popup.status === "now"
                    ? t("popupRadar.status.now")
                    : popup.status === "soon"
                      ? t("popupRadar.status.soon")
                      : t("popupRadar.status.ended")}
                </span>
              </div>
              <div className="p-5 text-sm text-[var(--ink-muted)]">
                <p className="line-clamp-3">{popup.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {status === "success" && topPopups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-8 text-center text-sm text-[var(--ink-muted)]">
          {t("popupRadar.empty")}
        </p>
      )}

      {status === "loading" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <PopupCardSkeleton key={idx} />
          ))}
        </div>
      )}
    </section>
  );
}
