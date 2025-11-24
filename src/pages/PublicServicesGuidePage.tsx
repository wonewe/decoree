import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { SERVICE_GUIDES } from "../data/localSupport";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function PublicServicesGuidePage() {
  const { t } = useI18n();
  return (
    <LocalSupportAccessGate>
      <section className="section-container space-y-8">
        <header className="space-y-4">
          <span className="badge-label">
            {t("nav.localSupport")}
          </span>
          <h1 className="text-4xl font-bold text-[var(--ink)]">{t("localSupport.services.title")}</h1>
          <p className="max-w-3xl text-[var(--ink-muted)]">{t("localSupport.services.subtitle")}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICE_GUIDES.map((section) => (
            <Link
              key={section.id}
              to={`/local-support/services/${section.id}`}
              className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-[var(--ink)]">{section.title}</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{section.summary}</p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--ink-muted)]">
                {section.checklist.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[var(--ink)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>
    </LocalSupportAccessGate>
  );
}
