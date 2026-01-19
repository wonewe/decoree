import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

interface Advantage {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const ADVANTAGES: Advantage[] = [
  {
    icon: "📚",
    titleKey: "home.tutoring.advantage.trendBased.title",
    descriptionKey: "home.tutoring.advantage.trendBased.description"
  },
  {
    icon: "👥",
    titleKey: "home.tutoring.advantage.genZPeer.title",
    descriptionKey: "home.tutoring.advantage.genZPeer.description"
  },
  {
    icon: "🎯",
    titleKey: "home.tutoring.advantage.realLifeMission.title",
    descriptionKey: "home.tutoring.advantage.realLifeMission.description"
  }
];

export default function TutoringPreview() {
  const { t } = useI18n();

  return (
    <section className="section-container space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="badge-label">{t("home.tutoring.badge")}</span>
          <h2 className="text-3xl font-bold text-[var(--ink)]">
            {t("home.tutoring.title")}
          </h2>
          <p className="max-w-2xl text-[var(--ink-muted)]">
            {t("home.tutoring.subtitle")}
          </p>
        </div>
        <Link to="/tutoring" className="secondary-button">
          {t("home.tutoring.cta")}
        </Link>
      </div>

      <Link to="/tutoring" className="card group flex flex-col gap-6 md:flex-row">
        <div className="h-48 w-full overflow-hidden rounded-2xl bg-[var(--paper-muted)] md:h-auto md:w-64">
          <img
            src="/tutor-preview.jpg"
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/main1.jpg";
            }}
          />
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
            {t("home.tutoring.badge")}
          </p>
          <h3 className="text-2xl font-semibold text-[var(--ink)]">
            {t("home.tutoring.card.title")}
          </h3>
          <p className="text-sm text-[var(--ink-muted)]">
            {t("home.tutoring.card.description")}
          </p>
          <span className="inline-block text-sm font-semibold text-[var(--ink)]">
            {t("home.tutoring.card.cta")} →
          </span>
        </div>
      </Link>

      <div className="grid gap-4 md:grid-cols-3">
        {ADVANTAGES.map(({ icon, titleKey, descriptionKey }) => (
          <div
            key={titleKey}
            className="rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm"
          >
            <div className="mb-3 text-3xl">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-[var(--ink)]">
              {t(titleKey)}
            </h3>
            <p className="text-sm text-[var(--ink-muted)]">
              {t(descriptionKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
