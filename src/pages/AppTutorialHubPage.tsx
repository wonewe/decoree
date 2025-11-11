import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { APP_TUTORIALS } from "../data/localSupport";

export default function AppTutorialHubPage() {
  const { t } = useI18n();
  return (
    <section className="section-container space-y-8">
      <header className="space-y-4">
        <span className="badge-label bg-hanBlue/10 text-hanBlue">
          {t("nav.localSupport")}
        </span>
        <h1 className="text-4xl font-bold text-dancheongNavy">{t("localSupport.apps.title")}</h1>
        <p className="max-w-3xl text-slate-600">{t("localSupport.apps.subtitle")}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {APP_TUTORIALS.map((app) => (
          <Link
            key={app.id}
            to={`/local-support/apps/${app.id}`}
            className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-dancheongNavy">{app.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{app.summary}</p>
            <ol className="mt-4 space-y-2 text-xs text-slate-600">
              {app.steps.slice(0, 3).map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="text-hanBlue">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Link>
        ))}
      </div>
    </section>
  );
}
