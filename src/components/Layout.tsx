import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../shared/i18n";
import { useHeaderAuth } from "../hooks/useHeaderAuth";
import { usePageTracking } from "../hooks/usePageTracking";
import LanguageSwitcher from "./LanguageSwitcher";
import LanguagePrompt from "./LanguagePrompt";
import { useTheme } from "../hooks/useTheme";
import { FeedbackPrompt } from "./FeedbackPrompt";

const primaryNav = [
  { path: "/trends", labelKey: "nav.trends" },
  // { path: "/events", labelKey: "nav.events" }, // 임시 숨김
  { path: "/popups", labelKey: "nav.popups" },
  { path: "/tutoring", labelKey: "nav.tutoring" }
  // { path: "/phrasebook", labelKey: "nav.phrasebook" } // 임시 숨김
] as const;

export default function Layout() {
  const { t, setLanguage } = useI18n();
  const { user, isAdmin, handleLogout, isProcessing, error: authError, dismissError } =
    useHeaderAuth();
  const location = useLocation();
  const { resolvedTheme, cycleTheme, preference } = useTheme();
  usePageTracking();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    // 페이지 이동 시 모바일 카테고리 드롭다운 닫기
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      // 아래로 충분히 스크롤하면 헤더 숨김, 위로 스크롤하면 다시 표시
      if (currentY > 80 && delta > 6) {
        setShowHeader(false);
      } else if (delta < -6 || currentY < 80) {
        setShowHeader(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-[var(--paper-muted)] text-[var(--ink)]">
      <LanguagePrompt onSelect={setLanguage} />
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        {isNoIndex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      <header
        className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--paper)]/90 backdrop-blur transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
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
                  `inline-flex rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "border-[var(--border-strong)] bg-[var(--paper)] text-[var(--ink)]"
                      : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
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
            {/* 모바일: 다크 모드 토글 오른쪽에 카테고리 열기 버튼 */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--paper)] text-[var(--ink-subtle)] shadow-sm transition hover:-translate-y-0.5 hover:text-[var(--ink)] md:hidden"
              aria-label="카테고리 열기"
              aria-expanded={mobileNavOpen}
            >
              <span className="flex flex-col items-center justify-center gap-[2px]">
                <span className="h-[3px] w-[3px] rounded-full bg-current" />
                <span className="h-[3px] w-[3px] rounded-full bg-current" />
                <span className="h-[3px] w-[3px] rounded-full bg-current" />
              </span>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="inline-flex rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] md:hidden"
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

        {/* 모바일: 카테고리 버튼 드롭다운 (헤더 아래로 펼쳐짐) */}
        {mobileNavOpen && (
          <div className="mx-auto max-w-6xl px-6 pb-3 md:hidden">
            <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--paper)] shadow-lg">
              <div className="flex flex-wrap gap-2 px-3 py-3">
                {primaryNav.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-subtle)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
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
                      `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--paper)] text-[var(--ink-subtle)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      }`
                    }
                  >
                    {t("nav.admin")}
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}

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
      <FeedbackPrompt />
    </div>
  );
}
