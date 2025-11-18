import { Link } from "react-router-dom";
import { usePopups } from "../hooks/usePopups";
import { useI18n } from "../shared/i18n";

export default function PopupRadarPreview() {
  const { t, language } = useI18n();
  const { status, popups } = usePopups(language);
  const topPopups = popups.slice(0, 4);

  return (
    <section className="section-container space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="badge-label bg-hanBlue/10 text-hanBlue">
            {t("nav.popups")}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-dancheongNavy">{t("popupRadar.title")}</h2>
          <p className="text-sm text-slate-500">{t("popupRadar.subtitle")}</p>
        </div>
        <Link
          to="/popups"
          className="rounded-full border border-hanBlue px-4 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
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
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1"
            >
              <img
                src={popup.posterUrl}
                alt={popup.title}
                className="h-60 w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
              <div className="relative flex flex-1 flex-col justify-end p-4">
                <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                  {popup.status === "now" ? t("popupRadar.status.now") : t("popupRadar.status.soon")}
                </span>
                <h3 className="mt-3 line-clamp-2 text-lg font-semibold drop-shadow">{popup.title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{popup.location}</p>
                <p className="mt-1 text-xs text-white/70 line-clamp-2">{popup.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {status === "success" && topPopups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
          {t("popupRadar.empty")}
        </p>
      )}

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-60 animate-pulse rounded-[28px] bg-slate-200" />
          ))}
        </div>
      )}
    </section>
  );
}
