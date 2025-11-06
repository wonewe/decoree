import { FormEvent, useEffect, useMemo, useState } from "react";
import { redirectToStripeCheckout } from "../services/subscriptionService";
import { useI18n } from "../shared/i18n";
import { usePremiumAccess } from "../shared/premiumAccess";

const pricePlanId = import.meta.env.VITE_STRIPE_PRICE_ID;
const stripeEnabled = import.meta.env.VITE_STRIPE_ENABLED === "true";

export default function SubscriptionSection() {
  const { t } = useI18n();
  const { hasPremiumAccess, unlockPremium } = usePremiumAccess();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const priceId = useMemo(() => pricePlanId, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      unlockPremium();
    }
  }, [unlockPremium]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripeEnabled) {
      setError(t("subscription.disabledMessage"));
      setLoading(false);
      return;
    }
    if (!priceId) {
      setError(t("subscription.missingPrice"));
      setLoading(false);
      return;
    }
    try {
      await redirectToStripeCheckout({
        email,
        planId: priceId
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <section className="section-container">
      <div className="card space-y-6 bg-gradient-to-br from-white to-slate-50">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-dancheongNavy">{t("subscription.title")}</h2>
          <p className="text-slate-600">{t("subscription.subtitle")}</p>
          <p className="text-lg font-semibold text-hanBlue">{t("subscription.price")}</p>
          <p className="text-xs text-slate-400">
            {stripeEnabled ? t("subscription.warning") : t("subscription.disabledNotice")}
          </p>
          {hasPremiumAccess && (
            <p className="rounded-full bg-dancheongGreen/10 px-4 py-2 text-xs font-semibold text-dancheongGreen">
              {t("subscription.active")}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="email"
            required
            placeholder="email@exemple.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading || !stripeEnabled}
            className="w-full rounded-full border border-slate-200 px-4 py-3 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue disabled:bg-slate-100 disabled:text-slate-400"
          />
          <button
            type="submit"
            className="primary-button w-full md:w-auto disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={loading || !stripeEnabled}
          >
            {stripeEnabled
              ? loading
                ? t("subscription.loading")
                : t("subscription.cta")
              : t("subscription.disabledCta")}
          </button>
        </form>
        {error && (
          <p className="rounded-2xl bg-dancheongRed/10 px-4 py-2 text-sm text-dancheongRed">{error}</p>
        )}
      </div>
    </section>
  );
}
