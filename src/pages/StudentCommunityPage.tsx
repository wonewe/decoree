import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import { COMMUNITY_BOARDS } from "../data/localSupport";

export default function StudentCommunityPage() {
  const { t } = useI18n();
  return (
    <section className="section-container space-y-8">
      <header className="space-y-4">
        <span className="badge-label bg-hanBlue/10 text-hanBlue">
          {t("nav.localSupport")}
        </span>
        <h1 className="text-4xl font-bold text-dancheongNavy">{t("localSupport.community.title")}</h1>
        <p className="max-w-3xl text-slate-600">{t("localSupport.community.subtitle")}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {COMMUNITY_BOARDS.map((board) => (
          <Link
            key={board.id}
            to={`/local-support/community/${board.id}`}
            className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-dancheongNavy">{board.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{board.summary}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              {board.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-hanBlue">#</span>
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
