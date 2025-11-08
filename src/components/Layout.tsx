import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
import { useHeaderAuth } from "../hooks/useHeaderAuth";

const exploreLinks = [
  { path: "/trends", labelKey: "nav.trends" },
  { path: "/events", labelKey: "nav.events" },
  { path: "/popups", labelKey: "nav.popups" },
  { path: "/culture-test", labelKey: "nav.cultureTest" }
] as const;

export default function Layout() {
  const { t } = useI18n();
  const { user, isAdmin, handleLogout, isProcessing, error: authError, dismissError } =
    useHeaderAuth();
  const location = useLocation();
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const isExploreActive = exploreLinks.some((link) =>
    location.pathname.startsWith(link.path)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!exploreRef.current) return;
      if (!exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };

    if (isExploreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExploreOpen]);

  useEffect(() => {
    setIsExploreOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-hanBlue">
            Decorée
          </NavLink>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <div className="relative" ref={exploreRef}>
              <button
                type="button"
                onClick={() => setIsExploreOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${
                  isExploreActive || isExploreOpen
                    ? "bg-hanBlue text-white shadow-lg"
                    : "text-slate-600 hover:text-hanBlue"
                }`}
                aria-haspopup="menu"
                aria-expanded={isExploreOpen}
              >
                {t("nav.explore")}
                <span className="text-xs">{isExploreOpen ? "▲" : "▼"}</span>
              </button>
              {isExploreOpen && (
                <div className="absolute right-0 z-10 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {exploreLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsExploreOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2 text-sm transition ${
                          isActive
                            ? "bg-hanBlue text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-hanBlue"
                        }`
                      }
                    >
                      {t(link.labelKey)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            <NavLink
              to="/phrasebook"
              className={({ isActive }) =>
                `transition hover:text-hanBlue ${
                  isActive ? "text-hanBlue" : "text-slate-600"
                }`
              }
            >
              {t("nav.phrasebook")}
            </NavLink>
            <NavLink
              to="/subscribe"
              className={({ isActive }) =>
                `transition hover:text-hanBlue ${
                  isActive ? "text-hanBlue" : "text-slate-600"
                }`
              }
            >
              {t("nav.subscribe")}
            </NavLink>
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
            {user ? (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/profile"
                  className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
                >
                  {user.displayName?.trim() || user.email}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-dancheongRed px-3 py-1 text-xs font-semibold text-dancheongRed transition hover:bg-dancheongRed/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isProcessing}
                >
                  {isProcessing ? t("auth.loading") : t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink
                  to="/login"
                  className="rounded-full border border-hanBlue px-4 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
                >
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
                >
                  {t("auth.signup")}
                </NavLink>
              </div>
            )}
          </div>
        </div>
        {authError && (
          <div className="bg-dancheongRed/10 px-4 py-2 text-xs text-dancheongRed">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <span>{authError}</span>
              <button
                type="button"
                onClick={dismissError}
                className="rounded-full border border-dancheongRed px-3 py-1 text-[10px] font-semibold transition hover:bg-dancheongRed/10"
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
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Decorée. {t("footer.madeIn")}.</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com" className="hover:text-hanBlue" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.tiktok.com" className="hover:text-hanBlue" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="mailto:hello@decoree.app" className="hover:text-hanBlue">
              hello@decoree.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
