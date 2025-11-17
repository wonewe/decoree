import { useParams, Link } from "react-router-dom";
import { APP_TUTORIALS } from "../data/localSupport";
import { useI18n } from "../shared/i18n";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function AppTutorialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const tutorial = APP_TUTORIALS.find((item) => item.id === id);

  return (
    <LocalSupportAccessGate>
      {!tutorial ? (
        <section className="section-container space-y-4 text-center">
          <p className="text-slate-600">Tutoriel introuvable.</p>
          <Link to="/local-support/apps" className="primary-button inline-flex justify-center">
            ← {t("trendDetail.backToList")}
          </Link>
        </section>
      ) : (
        <section className="section-container space-y-8">
          <header className="space-y-3">
            <span className="badge-label bg-hanBlue/10 text-hanBlue">{t("nav.localSupport")}</span>
            <h1 className="text-4xl font-bold text-dancheongNavy">{tutorial.name}</h1>
            <p className="text-slate-600">{tutorial.summary}</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-dancheongNavy">Steps</h2>
              <ol className="mt-4 space-y-2 text-sm text-slate-600">
                {tutorial.steps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="text-hanBlue">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
            <article className="rounded-3xl bg-slate-50 p-6 shadow">
              <h2 className="text-xl font-semibold text-dancheongNavy">Tips</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {tutorial.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          </div>
          <Link to="/local-support/apps" className="secondary-button">
            ← {t("trendDetail.backToList")}
          </Link>
        </section>
      )}
    </LocalSupportAccessGate>
  );
}
