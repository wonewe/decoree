import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { COMMUNITY_BOARDS } from "../data/localSupport";
import LocalSupportAccessGate from "../components/LocalSupportAccessGate";

export default function StudentCommunityPage() {
  const { t } = useI18n();
  return (
    <LocalSupportAccessGate>
      <section className="section-container space-y-8">
        <header className="space-y-4">
          <span className="badge-label">
            {t("nav.localSupport")}
          </span>
          <h1 className="text-4xl font-bold text-[var(--ink)]">{t("localSupport.community.title")}</h1>
          <p className="max-w-3xl text-[var(--ink-muted)]">{t("localSupport.community.subtitle")}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {COMMUNITY_BOARDS.map((board) => (
            <Link
              key={board.id}
              to={`/local-support/community/${board.id}`}
              className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-[var(--ink)]">{board.name}</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{board.summary}</p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--ink-muted)]">
                {board.highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[var(--ink)]">#</span>
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
