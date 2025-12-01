import { useParams, Link } from "react-router-dom";
import { COMMUNITY_BOARDS } from "../data/localSupport";
import { useI18n } from "../shared/i18n";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function CommunityBoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const board = COMMUNITY_BOARDS.find((item) => item.id === id);

  return (
    <LocalSupportAccessGate>
      {!board ? (
        <section className="section-container space-y-4 text-center">
          <p className="text-[var(--ink-muted)]">Board introuvable.</p>
          <Link to="/local-support/community" className="primary-button inline-flex justify-center">
            ← {t("trendDetail.backToList")}
          </Link>
        </section>
      ) : (
        <section className="section-container space-y-8">
          <header className="space-y-3">
            <span className="badge-label">{t("nav.localSupport")}</span>
            <h1 className="text-4xl font-bold text-[var(--ink)]">{board.name}</h1>
            <p className="text-lg leading-relaxed text-[var(--ink)]">{board.summary}</p>
          </header>
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow">
            <h2 className="text-xl font-semibold text-[var(--ink)]">Highlights</h2>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-[var(--ink)]">
              {board.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[var(--ink)]">#</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-[var(--ink)]">Contact: {board.contact}</p>
          </article>
          <Link to="/local-support/community" className="secondary-button">
            ← {t("trendDetail.backToList")}
          </Link>
        </section>
      )}
    </LocalSupportAccessGate>
  );
}
