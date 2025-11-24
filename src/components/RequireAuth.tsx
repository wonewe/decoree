import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";

type RequireAuthProps = {
  children: JSX.Element;
  requireAdmin?: boolean;
};

export default function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, loading, firebaseError, isAdmin } = useAuth();
  const location = useLocation();
  const { t } = useI18n();

  if (loading) {
    return (
      <section className="section-container">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center shadow">
          <p className="text-sm text-[var(--ink-muted)]">{t("auth.loading")}</p>
        </div>
      </section>
    );
  }

  if (firebaseError) {
    return (
      <section className="section-container">
        <div className="rounded-3xl border border-rose-200 bg-[var(--paper)] p-10 text-center text-sm text-rose-800 shadow">
          <p>{t("auth.firebaseError")}</p>
          <p className="mt-2 text-[var(--ink-muted)]">{firebaseError}</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <section className="section-container">
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center shadow">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">{t("auth.adminOnlyTitle")}</h2>
          <p className="text-sm text-[var(--ink-muted)]">{t("auth.adminOnlyDescription")}</p>
          <Link
            to="/"
            className="mx-auto inline-flex items-center rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
          >
            {t("auth.adminOnlyCta")}
          </Link>
        </div>
      </section>
    );
  }

  return children;
}
