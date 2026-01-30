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
  { path: "/tutoring", labelKey: "nav.tutoring" },
  { path: "/tutoring/membership", labelKey: "nav.membership" },
  { path: "/newsletter", labelKey: "nav.newsletter" }
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
        className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur-sm transition-transform duration-200 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 md:py-4">
          <NavLink to="/" className="font-heading text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
            koraid
          </NavLink>
          <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--ink-muted)] md:flex">
            {primaryNav.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors duration-150 ${
                    isActive ? "text-[var(--ink)] font-semibold" : "hover:text-[var(--ink)]"
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
                  `inline-flex rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                    isActive
                      ? "border-[var(--border-strong)] bg-[var(--paper-accent)] text-[var(--ink)]"
                      : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  }`
                }
              >
                {t("nav.admin")}
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={cycleTheme}
              className="rounded-full border border-[var(--border)] p-2.5 text-xs text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? "☀️" : preference === "system" ? "🌓" : "🌙"}
            </button>
            {/* 모바일: 다크 모드 토글 오른쪽에 카테고리 열기 버튼 */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 md:hidden"
              aria-label="카테고리 열기"
              aria-expanded={mobileNavOpen}
            >
              <span className="flex flex-col items-center justify-center gap-1">
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="inline-flex rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] md:hidden"
                  >
                    {t("nav.admin")}
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className="hidden rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] md:inline-flex"
                >
                  {user.displayName?.trim() || user.email}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? t("auth.loading") : t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink
                  to="/login"
                  className="min-h-[44px] rounded-full border border-[var(--border)] px-3 py-2.5 text-sm font-medium text-[var(--ink-muted)] transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
                >
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--ink)] px-3 py-2.5 text-sm font-medium text-[var(--paper)] transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--ink)_92%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
                >
                  {t("auth.signup")}
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* 모바일: 카테고리 버튼 드롭다운 (헤더 아래로 펼쳐짐) */}
        {mobileNavOpen && (
          <div className="mx-auto max-w-6xl border-t border-[var(--border)] bg-[var(--paper)] px-6 py-3 md:hidden">
            <div className="flex flex-wrap gap-2">
              {primaryNav.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                      isActive
                        ? "border-[var(--ink)] bg-[var(--paper-accent)] text-[var(--ink)]"
                        : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
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
                    `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                      isActive
                        ? "border-[var(--ink)] bg-[var(--paper-accent)] text-[var(--ink)]"
                        : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                    }`
                  }
                >
                  {t("nav.admin")}
                </NavLink>
              )}
            </div>
          </div>
        )}

        {authError && (
          <div className="border-b border-rose-200 bg-rose-50/50 px-4 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <span>{authError}</span>
              <button
                type="button"
                onClick={dismissError}
                className="rounded-full px-2 py-1 text-xs font-medium transition-colors duration-150 hover:bg-rose-100 dark:hover:bg-rose-900/50"
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
      <footer className="border-t border-[var(--border)] bg-[var(--paper)] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-5 mb-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--ink)]">About</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>
                  <NavLink to="/" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.home") || "Home"}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/trends" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.trends")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/popups" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.popups")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tutoring" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.tutoring")}
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--ink)]">Resources</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>
                  <NavLink to="/newsletter" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.newsletter")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/phrasebook" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.phrasebook")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/local-support/services" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.localSupport")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/culture-test" className="hover:text-[var(--ink)] transition-colors duration-150">
                    {t("nav.cultureTest")}
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--ink)]">Connect</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>
                  <a href="https://www.instagram.com/koraid.official/" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@koraid" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    TikTok
                  </a>
                </li>
                <li>
                  <a href="mailto:Team@kor-aid.com" className="hover:text-[var(--ink)] transition-colors duration-150">
                    Team@kor-aid.com
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--ink)]">External Resources</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>
                  <a href="https://www.visitkorea.or.kr" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    Visit Korea
                  </a>
                </li>
                <li>
                  <a href="https://www.seoul.go.kr" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    Seoul Metropolitan Government
                  </a>
                </li>
                <li>
                  <a href="https://www.1330.or.kr" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    Tourism Hotline 1330
                  </a>
                </li>
                <li>
                  <a href="https://www.hikorea.go.kr" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                    HiKorea (Immigration)
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--ink)]">Legal</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li>
                  <span className="text-[var(--ink-subtle)]">{t("footer.madeIn")}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-[var(--ink-muted)]">
            <span>
              © {new Date().getFullYear()} koraid · {t("footer.madeIn")}
            </span>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.instagram.com/koraid.official/" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@koraid" className="hover:text-[var(--ink)] transition-colors duration-150" target="_blank" rel="noreferrer noopener">
                TikTok
              </a>
              <a href="mailto:Team@kor-aid.com" className="hover:text-[var(--ink)] transition-colors duration-150">
                Team@kor-aid.com
              </a>
            </div>
          </div>
        </div>
      </footer>
      <FeedbackPrompt />
    </div>
  );
}
