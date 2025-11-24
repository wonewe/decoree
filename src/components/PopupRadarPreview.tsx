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
          <span className="badge-label bg-hanBlue/10 text-hanBlue">
            {t("nav.popups")}
          </span>
          <h2 className="text-3xl font-bold text-dancheongNavy">{t("popupRadar.title")}</h2>
          <p className="max-w-2xl text-slate-600">{t("popupRadar.subtitle")}</p>
        </div>
        <Link
          to="/popups"
          className="rounded-full border border-hanBlue px-6 py-2.5 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
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
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white text-dancheongNavy shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={popup.posterUrl}
                  alt={popup.title}
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                      popup.status === "ended" ? "bg-slate-800/70" : "bg-black/40"
                    }`}
                  >
                    {popup.status === "now"
                      ? t("popupRadar.status.now")
                      : popup.status === "soon"
                        ? t("popupRadar.status.soon")
                        : t("popupRadar.status.ended")}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-dancheongNavy group-hover:text-hanBlue transition-colors">
                    {popup.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {popup.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="line-clamp-1">{popup.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {status === "success" && topPopups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
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
