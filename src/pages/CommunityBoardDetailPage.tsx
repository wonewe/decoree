import { useParams, Link } from "react-router-dom";
import { COMMUNITY_BOARDS } from "../data/localSupport";
import { useI18n } from "../shared/i18n";

export default function CommunityBoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const board = COMMUNITY_BOARDS.find((item) => item.id === id);

  if (!board) {
    return (
      <section className="section-container space-y-4 text-center">
        <p className="text-slate-600">Board introuvable.</p>
        <Link to="/local-support/community" className="primary-button inline-flex justify-center">
          ← {t("trendDetail.backToList")}
        </Link>
      </section>
    );
  }

  return (
    <section className="section-container space-y-8">
      <header className="space-y-3">
        <span className="badge-premium bg-hanBlue/10 text-hanBlue">{t("nav.localSupport")}</span>
        <h1 className="text-4xl font-bold text-dancheongNavy">{board.name}</h1>
        <p className="text-slate-600">{board.summary}</p>
      </header>
      <article className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-dancheongNavy">Highlights</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {board.highlights.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-hanBlue">#</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-500">Contact: {board.contact}</p>
      </article>
      <Link to="/local-support/community" className="secondary-button">
        ← {t("trendDetail.backToList")}
      </Link>
    </section>
  );
}
