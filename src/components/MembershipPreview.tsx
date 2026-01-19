import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";

interface PlanFeature {
  key: string;
}

interface Plan {
  id: "basic" | "pro";
  titleKey: string;
  priceKey: string;
  sessionsKey: string;
  features: PlanFeature[];
  ctaKey: string;
  isPopular?: boolean;
  badgeKey?: string;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    titleKey: "home.membership.basic.title",
    priceKey: "home.membership.basic.price",
    sessionsKey: "home.membership.basic.sessions",
    features: [
      { key: "home.membership.basic.feature1" },
      { key: "home.membership.basic.feature2" }
    ],
    ctaKey: "home.membership.learnMore"
  },
  {
    id: "pro",
    titleKey: "home.membership.pro.title",
    priceKey: "home.membership.pro.price",
    sessionsKey: "home.membership.pro.sessions",
    features: [
      { key: "home.membership.pro.feature1" },
      { key: "home.membership.pro.feature2" },
      { key: "home.membership.pro.feature3" }
    ],
    ctaKey: "home.membership.getStarted",
    isPopular: true,
    badgeKey: "home.membership.pro.badge"
  }
];

interface PricingCardProps {
  plan: Plan;
  t: (key: string) => string;
}

function PricingCard({ plan, t }: PricingCardProps) {
  const cardClasses = plan.isPopular
    ? "relative flex flex-col rounded-2xl border-2 border-[var(--accent)] bg-[var(--paper)] p-6 shadow-sm"
    : "flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm";

  const buttonClasses = plan.isPopular
    ? "primary-button w-full text-center"
    : "secondary-button w-full text-center";

  return (
    <div className={cardClasses}>
      {plan.isPopular && plan.badgeKey && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-semibold text-white">
          {t(plan.badgeKey)}
        </div>
      )}

      <div className="mb-4">
        <h3 className="mb-1 text-xl font-bold text-[var(--ink)]">
          {t(plan.titleKey)}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[var(--ink)]">
            {t(plan.priceKey)}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {t(plan.sessionsKey)}
        </p>
      </div>

      <ul className="mb-6 flex-grow space-y-2 text-sm text-[var(--ink-muted)]">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex items-center gap-2">
            <span className="text-[var(--accent)]">✓</span>
            <span>{t(feature.key)}</span>
          </li>
        ))}
      </ul>

      <Link to="/tutoring/membership" className={buttonClasses}>
        {t(plan.ctaKey)}
      </Link>
    </div>
  );
}

export default function MembershipPreview() {
  const { t } = useI18n();

  return (
    <section className="bg-[var(--paper-muted)] py-16">
      <div className="section-container space-y-10">
        <div className="space-y-3 text-center">
          <span className="badge-label">{t("home.membership.badge")}</span>
          <h2 className="text-3xl font-bold text-[var(--ink)]">
            {t("home.membership.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--ink-muted)]">
            {t("home.membership.subtitle")}
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} t={t} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/tutoring/membership"
            className="text-sm font-semibold text-[var(--ink)] underline-offset-4 hover:underline"
          >
            {t("home.membership.viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
