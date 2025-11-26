import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import { useHeaderAuth } from "../hooks/useHeaderAuth";
import { usePageTracking } from "../hooks/usePageTracking";
import LanguageSwitcher from "./LanguageSwitcher";
import LanguagePrompt from "./LanguagePrompt";
import { useTheme } from "../hooks/useTheme";

const primaryNav = [
  { path: "/trends", labelKey: "nav.trends" },
  { path: "/events", labelKey: "nav.events" },
  { path: "/popups", labelKey: "nav.popups" },
  { path: "/phrasebook", labelKey: "nav.phrasebook" }
] as const;

export default function Layout() {
  const { t, setLanguage } = useI18n();
  const { user, isAdmin, handleLogout, isProcessing, error: authError, dismissError } =
    useHeaderAuth();
  const location = useLocation();
  const { resolvedTheme, cycleTheme, preference } = useTheme();
  usePageTracking();

  const siteOrigin =
    import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "https://example.com");

  const canonicalUrl = useMemo(() => {
    const cleanPath = location.pathname || "/";
    return `${siteOrigin}${cleanPath}`;
  }, [location.pathname, siteOrigin]);

  const isNoIndex = useMemo(
    () => /^\/(admin|studio|internal)/i.test(location.pathname),
    [location.pathname]
  );

  return (
    <div className="min-h-screen bg-[var(--paper-muted)] text-[var(--ink)]">
      <LanguagePrompt onSelect={setLanguage} />
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        {isNoIndex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--paper)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/" className="font-heading text-2xl font-semibold tracking-tight text-[var(--ink)]">
            koraid
          </NavLink>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--ink-subtle)] md:flex">
            {primaryNav.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition ${
                    isActive ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"
                  }`
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `transition hover:text-hanBlue ${
                    isActive ? "text-hanBlue" : "text-slate-600"
                  }`
                }
              >
                {t("nav.admin")}
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={cycleTheme}
              className="rounded-full border border-[var(--border)] p-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? "☀️" : preference === "system" ? "🌓" : "🌙"}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="inline-flex rounded-full border border-hanBlue px-3 py-2 text-xs font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white md:hidden"
                  >
                    {t("nav.admin")}
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)] md:inline-flex"
                >
                  {user.displayName?.trim() || user.email}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isProcessing}
                >
                  {isProcessing ? t("auth.loading") : t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink
                  to="/login"
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {t("auth.signup")}
                </NavLink>
              </div>
            )}
          </div>
        </div>
        {authError && (
          <div className="bg-rose-50 px-4 py-2 text-xs text-rose-700">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <span>{authError}</span>
              <button
                type="button"
                onClick={dismissError}
                className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold transition hover:bg-rose-100"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] bg-[var(--paper)] py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-[var(--ink-muted)] md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} koraid · {t("footer.madeIn")}
          </span>
          <div className="flex flex-wrap gap-4">
            <a href="https://www.instagram.com" className="muted-link" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.tiktok.com" className="muted-link" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="mailto:Team@kor-aid.com" className="muted-link">
              Team@kor-aid.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
