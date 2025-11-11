import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { SERVICE_GUIDES } from "../data/localSupport";

export default function PublicServicesGuidePage() {
  const { t } = useI18n();
  return (
    <section className="section-container space-y-8">
      <header className="space-y-4">
        <span className="badge-label bg-hanBlue/10 text-hanBlue">
          {t("nav.localSupport")}
        </span>
        <h1 className="text-4xl font-bold text-dancheongNavy">{t("localSupport.services.title")}</h1>
        <p className="max-w-3xl text-slate-600">{t("localSupport.services.subtitle")}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {SERVICE_GUIDES.map((section) => (
          <Link
            key={section.id}
            to={`/local-support/services/${section.id}`}
            className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-dancheongNavy">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{section.summary}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              {section.checklist.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-hanBlue">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
