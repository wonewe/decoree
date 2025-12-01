import { useParams, Link } from "react-router-dom";
import { SERVICE_GUIDES } from "../data/localSupport";
import { useI18n } from "../shared/i18n";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function PublicServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const guide = SERVICE_GUIDES.find((item) => item.id === id);

  return (
    <LocalSupportAccessGate>
      {!guide ? (
        <section className="section-container space-y-4 text-center">
          <p className="text-[var(--ink-muted)]">Service introuvable.</p>
          <Link to="/local-support/services" className="primary-button inline-flex justify-center">
            ← {t("trendDetail.backToList")}
          </Link>
        </section>
      ) : (
        <section className="section-container space-y-8">
          <header className="space-y-3">
            <span className="badge-label">{t("nav.localSupport")}</span>
            <h1 className="text-4xl font-bold text-[var(--ink)]">{guide.title}</h1>
            <p className="text-[1.08rem] leading-relaxed text-[var(--ink)]">{guide.summary}</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow">
              <h2 className="text-xl font-semibold text-[var(--ink)]">Checklist</h2>
              <ul className="mt-4 space-y-2 text-base leading-relaxed text-[var(--ink)]">
                {guide.checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[var(--ink)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--paper-muted)] p-6 shadow">
              <h2 className="text-xl font-semibold text-[var(--ink)]">Calendrier</h2>
              <ul className="mt-4 space-y-2 text-base leading-relaxed text-[var(--ink)]">
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
      )}
    </LocalSupportAccessGate>
  );
}
