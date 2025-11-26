import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { APP_TUTORIALS } from "../data/localSupport";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function AppTutorialHubPage() {
  const { t } = useI18n();
  return (
    <LocalSupportAccessGate>
      <section className="section-container space-y-8">
        <header className="space-y-4">
          <span className="badge-label">
            {t("nav.localSupport")}
          </span>
          <h1 className="text-4xl font-bold text-[var(--ink)]">{t("localSupport.apps.title")}</h1>
          <p className="max-w-3xl text-[var(--ink-muted)]">{t("localSupport.apps.subtitle")}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {APP_TUTORIALS.map((app) => (
            <Link
              key={app.id}
              to={`/local-support/apps/${app.id}`}
              className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-[var(--ink)]">{app.name}</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{app.summary}</p>
              <ol className="mt-4 space-y-2 text-xs text-[var(--ink-muted)]">
                {app.steps.slice(0, 3).map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="text-[var(--ink)]">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Link>
          ))}
        </div>
      </section>
    </LocalSupportAccessGate>
  );
}
