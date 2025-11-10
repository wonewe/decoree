import { useParams, Link } from "react-router-dom";
import { SERVICE_GUIDES } from "../data/localSupport";
import { useI18n } from "../shared/i18n";

export default function PublicServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const guide = SERVICE_GUIDES.find((item) => item.id === id);

  if (!guide) {
    return (
      <section className="section-container space-y-4 text-center">
        <p className="text-slate-600">Service introuvable.</p>
        <Link to="/local-support/services" className="primary-button inline-flex justify-center">
          ← {t("trendDetail.backToList")}
        </Link>
      </section>
    );
  }

  return (
    <section className="section-container space-y-8">
      <header className="space-y-3">
        <span className="badge-premium bg-hanBlue/10 text-hanBlue">{t("nav.localSupport")}</span>
        <h1 className="text-4xl font-bold text-dancheongNavy">{guide.title}</h1>
        <p className="text-slate-600">{guide.summary}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-dancheongNavy">Checklist</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {guide.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-hanBlue">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl bg-slate-50 p-6 shadow">
          <h2 className="text-xl font-semibold text-dancheongNavy">Calendrier</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {guide.calendar.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <Link to="/local-support/services" className="secondary-button">
        ← {t("trendDetail.backToList")}
      </Link>
    </section>
  );
}
