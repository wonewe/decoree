import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="bg-gradient-to-br from-dancheongYellow/40 via-white to-dancheongGreen/10">
      <div className="section-container flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <span className="badge-premium mb-4">Decorée MVP</span>
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{t("hero.title")}</h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/trends" className="primary-button">
              {t("hero.cta.primary")}
            </Link>
            <Link to="/events" className="secondary-button">
              {t("hero.cta.secondary")}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="absolute -left-6 -top-6 h-14 w-14 rounded-full bg-dancheongRed/80 blur-2xl" />
            <div className="absolute -bottom-8 -right-10 h-20 w-20 rounded-full bg-hanBlue/50 blur-3xl" />
            <div className="relative space-y-4 text-sm">
              <h3 className="text-lg font-semibold text-dancheongNavy">Weekly Trend Decoder</h3>
              <p className="text-slate-600">
                Pop-up Han River Sunset Market <span className="ml-2 text-hanBlue">→</span>
              </p>
              <div className="rounded-2xl bg-slate-100 p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Phrasebook</span>
                <p className="mt-2 text-slate-700">맛있어요! — C&apos;est délicieux !</p>
              </div>
              <p className="text-xs text-slate-500">
                Stripe, Firebase, Google Maps — prêts pour l&apos;intégration finale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
